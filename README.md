# 📚 Study Assistant - AI Flashcard Generator

> **Frontend Internship Assignment Submission**  
> An AI-powered full-stack web application that transforms free-form study notes or topics into 10 structured, interactive 3D flashcards using Google Gemini AI.

---

## 🌟 Project Overview

**Study Assistant** is designed to accelerate learning by taking raw study notes, lecture summaries, or textbook topics and converting them into high-quality flashcards. 

### Key Highlights:
- **No Raw AI Text / Chatbot UI**: The AI response is strictly validated as structured JSON and rendered directly into custom React flashcard components.
- **Robust 6-Step JSON Validation**: Ensures absolute reliability before rendering any AI output.
- **Interactive 3D Flip Flashcards**: CSS perspective 3D animations, "Show Answer / Hide Answer" controls, and deck counter (`1 / 10`).
- **Full Edge-Case Resilience**: AbortController implementation for cancelling stale requests on rapid clicks, timeout handling, network error recovery, and empty input checks.
- **Bonus Features**: Dark / Light Mode theme toggle, Keyboard shortcuts (`←`, `→`, `Space`), LocalStorage note persistence, deck shuffle, progress bar, and sample note presets.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (with custom 3D perspective animations & glassmorphism)
- **Icons**: Lucide React & React Icons
- **HTTP Client**: Axios (with `AbortController` signal support)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**: CORS, dotenv, express.json
- **AI SDK**: `@google/genai` (Google Gemini 2.5 Flash Model)

### Deployment Targets
- **Frontend**: Vercel
- **Backend**: Render

---

## 📁 Folder Structure

```text
study-assistant/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Navbar with theme toggle & title
│   │   │   ├── Footer.jsx          # App footer with tech badges
│   │   │   ├── NotesInput.jsx      # Textarea, presets, counters & submit button
│   │   │   ├── Loading.jsx         # Skeleton loader with cycling status text
│   │   │   ├── ErrorState.jsx      # Accessible error alert with retry button
│   │   │   ├── Flashcard.jsx       # 3D interactive flip flashcard
│   │   │   └── FlashcardList.jsx   # Deck carousel, progress, keyboard shortcuts
│   │   ├── services/
│   │   │   └── api.js              # Axios API client with AbortController
│   │   ├── styles/
│   │   │   └── index.css           # Tailwind directives & 3D CSS utilities
│   │   ├── App.jsx                 # Central state management & auto-scroll
│   │   └── main.jsx                # React root entrypoint
│   ├── index.html
│   ├── vite.config.js              # Vite configuration & dev proxy
│   ├── tailwind.config.js          # Dark mode & animation config
│   ├── postcss.config.js
│   ├── package.json
│   └── vercel.json                 # Vercel SPA rewrite config
├── server/
│   ├── routes/
│   │   └── generate.js             # Gemini API route & strict JSON validator
│   ├── server.js                   # Express app server entrypoint
│   ├── package.json
│   ├── .env.example                # Environment variables template
│   └── .env                        # Local environment configuration
├── package.json                    # Workspace helper scripts
└── README.md                       # Comprehensive documentation
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Frontend (`client/.env`) - Optional for production
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Local Execution

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Step 1: Install Dependencies

Run from the root `study-assistant/` directory:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Or execute from the root directory:
```bash
npm run install:all
```

### Step 2: Start Backend Server

In the `server/` directory:
```bash
cd server
npm run dev
```
The server will start at `http://localhost:5000`.

### Step 3: Start Frontend Client

In a new terminal window, navigate to `client/`:
```bash
cd client
npm run dev
```
The Vite development server will open at `http://localhost:5173`.

---

## 🛡️ AI Prompt & Strict JSON Validation

### Prompt Configuration
The backend (`server/routes/generate.js`) enforces the strict prompt required by the specification:

```text
Return ONLY valid JSON.

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
No extra text.
```

### Multi-Step JSON Validation Pipeline
To ensure raw AI output is never trusted directly:
1. **Markdown Fence Stripping**: Cleans any ```json ... ``` wrappers automatically.
2. **Safe `JSON.parse()`**: Catches syntax errors and returns `422` with message `"AI returned invalid data."`
3. **Property Check**: Validates that the parsed object contains a `flashcards` property.
4. **Type Check**: Verifies `flashcards` is a JavaScript Array.
5. **Length Check**: Verifies array length > 0.
6. **Card Content Sanitization**: Ensures each object contains non-empty string `question` and `answer` fields, while ignoring extra/unexpected properties.

---

## ⚡ Error & Edge-Case Handling

| Scenario | Handled Behavior |
|---|---|
| **Empty Input** | Shows `"Please enter some notes."` without sending network requests. |
| **Loading State** | Disables Generate button and renders animated skeleton loader with cycling messages. |
| **Stale Responses** | Uses `AbortController` to cancel pending HTTP requests if user clicks Generate twice. |
| **Network Error / Backend Down** | Shows friendly connection error card with Retry button. |
| **Timeout (>30s)** | Shows `"The request is taking longer than expected."` |
| **Malformed JSON / Bad Shape** | Shows `"AI returned invalid data."` or `"Unexpected AI response."` |
| **Missing API Key** | Backend returns `500` explaining how to configure `GEMINI_API_KEY`. |

---

## 🌐 Deployment Instructions

### Deploy Frontend to Vercel
1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com) -> **Add New Project**.
3. Import the repository and select `client` as the **Root Directory**.
4. Framework Preset: **Vite**.
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-app.onrender.com/api`
6. Click **Deploy**.

### Deploy Backend to Render
1. Go to [Render Dashboard](https://render.com) -> **New Web Service**.
2. Connect your repository.
3. Set **Root Directory**: `server`
4. **Environment**: Node
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Add Environment Variable:
   - `GEMINI_API_KEY` = your actual Gemini API Key
8. Click **Create Web Service**.

---

## 🤖 AI Usage Note
- The Google Gemini API (`gemini-2.5-flash`) via `@google/genai` is used purely as a structured data transformation engine.
- Gemini receives the study notes and returns JSON matching the specified schema.
- The React application parses this structured payload to dynamically render interactive 3D flashcards.
- No direct raw text or chatbot stream is rendered to the user.

---

## ⚠️ Known Limitations
1. **API Rate Limits**: Standard free-tier Gemini API keys may hit rate limits if invoked dozens of times per minute.
2. **Extremely Long Inputs**: Input notes exceeding ~10,000 words may approach Gemini's context window limits or increase generation latency.

---

## ⏱️ Time Spent

| Phase | Estimated Hours |
|---|---|
| Architecture Planning & Design System | 0.5 hours |
| Backend & Express JSON Validation Pipeline | 1.0 hours |
| Frontend React Components & 3D Flip Card | 1.5 hours |
| Error Edge-Cases & AbortController | 0.5 hours |
| Testing, Polish & Documentation | 0.5 hours |
| **Total** | **~4.0 hours** |
