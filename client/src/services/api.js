import axios from 'axios';

// In production, configure environment base URL or relative path for Vite proxy/Vercel
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

/**
 * Sends study notes to the Express backend to generate structured flashcards.
 *
 * @param {string} notes - User provided study notes or topic text.
 * @param {AbortSignal} [signal] - Optional AbortSignal from AbortController to cancel stale requests.
 * @returns {Promise<{ flashcards: Array<{question: string, answer: string}>, count: number }>}
 */
export async function generateFlashcards(notes, signal) {
  if (!notes || !notes.trim()) {
    throw new Error('Please enter some notes.');
  }

  try {
    const response = await apiClient.post('/generate', { notes: notes.trim() }, { signal });

    if (response.data && response.data.success && Array.isArray(response.data.flashcards)) {
      return response.data;
    } else {
      throw new Error('Unexpected AI response.');
    }
  } catch (error) {
    if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
      const cancelErr = new Error('Request canceled');
      cancelErr.isCanceled = true;
      throw cancelErr;
    }

    if (error.code === 'ECONNABORTED' || error.response?.status === 408) {
      throw new Error('The request is taking longer than expected.');
    }

    if (error.response) {
      const serverMessage = error.response.data?.error || error.response.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      if (error.response.status === 422) {
        throw new Error('AI returned invalid data.');
      }
      if (error.response.status === 400) {
        throw new Error('Please enter some notes.');
      }
      throw new Error(`Server error (${error.response.status}). Please try again.`);
    }

    if (error.request) {
      throw new Error('Network error. Please check your connection or backend server.');
    }

    throw new Error(error.message || 'An unexpected error occurred.');
  }
}
