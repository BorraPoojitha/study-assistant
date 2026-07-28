import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Helper to sanitize markdown code blocks if the AI accidentally includes them
function cleanJsonString(rawText) {
  if (!rawText) return '';
  let cleaned = rawText.trim();
  // Strip Markdown code block indicators (```json ... ``` or ``` ...)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Validate AI response according to strict assignment requirements:
 * 1. JSON.parse() check
 * 2. Verify `flashcards` property exists
 * 3. Verify `flashcards` is an array
 * 4. Verify array length > 0
 * 5. Verify each card has valid `question` and `answer`
 * 6. Ignore extra properties
 */
function validateAndSanitizeFlashcards(parsedData) {
  if (!parsedData || typeof parsedData !== 'object') {
    return { valid: false, errorType: 'WRONG_SHAPE', message: 'Unexpected AI response.' };
  }

  if (!('flashcards' in parsedData)) {
    return { valid: false, errorType: 'WRONG_SHAPE', message: 'Unexpected AI response.' };
  }

  if (!Array.isArray(parsedData.flashcards)) {
    return { valid: false, errorType: 'WRONG_SHAPE', message: 'Unexpected AI response.' };
  }

  if (parsedData.flashcards.length === 0) {
    return { valid: false, errorType: 'EMPTY_FLASHCARDS', message: 'No flashcards generated.' };
  }

  const sanitizedCards = [];

  for (const item of parsedData.flashcards) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const question = typeof item.question === 'string' ? item.question.trim() : '';
    const answer = typeof item.answer === 'string' ? item.answer.trim() : '';

    if (question && answer) {
      sanitizedCards.push({ question, answer });
    }
  }

  if (sanitizedCards.length === 0) {
    return { valid: false, errorType: 'EMPTY_FLASHCARDS', message: 'No flashcards generated.' };
  }

  return { valid: true, flashcards: sanitizedCards };
}

router.post('/', async (req, res) => {
  try {
    const { notes } = req.body;

    // Check 1: Empty input check
    if (!notes || typeof notes !== 'string' || notes.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please enter some notes.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({
        success: false,
        error: 'API key not configured. Please set GEMINI_API_KEY in server/.env file.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Strict prompt as required
    const systemPrompt = `Return ONLY valid JSON.

Schema
{
  "flashcards":[
    {
      "question":"string",
      "answer":"string"
    }
  ]
}

Generate exactly 10 flashcards.
No markdown.
No explanation.
No extra text.`;

    const userPrompt = `Study Notes:\n"""\n${notes.trim()}\n"""`;

    // Candidate models to try in sequence for maximum compatibility
    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let response = null;
    let lastGenError = null;

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: `${systemPrompt}\n\n${userPrompt}`,
          config: {
            responseMimeType: 'application/json'
          }
        });
        if (response && response.text) break;
      } catch (err) {
        lastGenError = err;
        // If it's an authentication error (e.g. invalid key), no need to loop further
        if (
          err.message?.includes('API key') ||
          err.message?.includes('API_KEY') ||
          err.status === 400 ||
          err.status === 401 ||
          err.status === 403
        ) {
          throw err;
        }
      }
    }

    if (!response && lastGenError) {
      throw lastGenError;
    }

    const rawText = typeof response.text === 'function' ? response.text() : response.text;
    const cleanedText = cleanJsonString(rawText);

    // Step 1 Validation: Safe JSON parsing
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error('JSON Parse Error:', parseErr.message, 'Raw Output:', rawText);
      return res.status(422).json({
        success: false,
        error: 'AI returned invalid data.'
      });
    }

    // Step 2-6 Validation: Structure & Content Verification
    const validation = validateAndSanitizeFlashcards(parsedData);
    if (!validation.valid) {
      return res.status(422).json({
        success: false,
        error: validation.message
      });
    }

    return res.status(200).json({
      success: true,
      flashcards: validation.flashcards,
      count: validation.flashcards.length
    });

  } catch (error) {
    console.error('Generate Route Error:', error);

    // Handle Abort or Timeout errors
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      return res.status(408).json({
        success: false,
        error: 'The request is taking longer than expected.'
      });
    }

    const errMsg = error.message || '';
    if (
      errMsg.includes('API key not valid') ||
      errMsg.includes('API_KEY_INVALID') ||
      errMsg.includes('400') ||
      errMsg.includes('401') ||
      errMsg.includes('403') ||
      errMsg.includes('unauthorized')
    ) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Gemini API Key. Please get a free API key from Google AI Studio (https://aistudio.google.com/app/apikey) and update GEMINI_API_KEY in server/.env.'
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate flashcards. Please try again.'
    });
  }
});

export default router;
