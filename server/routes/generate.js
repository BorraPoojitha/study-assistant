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

    // Call Gemini API using @google/genai SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${systemPrompt}\n\n${userPrompt}`,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const rawText = response.text;
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

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate flashcards. Please try again.'
    });
  }
});

export default router;
