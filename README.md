# DevEnglish - The 35-Day Bootcamp

Web platform for learning technical English designed for Spanish-speaking developers. 35 days of lessons organized into modules, with real-world vocabulary, grammar applied to programming, mini-games, and an AI Tech Lead that reviews your writing.

![stack](https://img.shields.io/badge/Next.js-14-black) ![tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8) ![framer](https://img.shields.io/badge/Framer_Motion-11-ff0080)

## Features

- Sidebar with modules and 35 days, global progress tracking, and sequential unlocking (complete day N to unlock N+1).
- Comprehensive lessons per day: objective, vocabulary table (with audio pronunciation via Web Speech API), grammar applied to code, and multimedia resources.
- 3 reusable mini-games:
  - Match the Cards - match English terms with their Spanish translations.
  - Bug Hunter - fill in the blanks in code snippets or bug reports using a word bank.
  - Tech Wordle - guess the programming-related word.
- AI Tutor (Daily Code Review): write a text applying what you learned, and an OpenRouter model will provide a score (1-10), feedback, and a corrected version in JSON.
- IDE-style dark mode, responsive design, animations with Framer Motion, and confetti upon day completion.
- Persistent progress saved in localStorage using Zustand.

## Stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| State Management | Zustand (+ persist) |
| AI Integration | OpenRouter Chat Completions API (BYOK) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## OpenRouter API Key (BYOK)

The application uses a Bring Your Own Key model: your API Key is entered directly in the application and saved only in your browser (localStorage). No local .env file with the key is required.

1. Generate an API Key at [openrouter.ai/keys](https://openrouter.ai/keys) (free and low-cost models are available).
2. In the application, open Settings (gear icon at the bottom of the sidebar).
3. Paste your key and select the model (defaults to google/gemini-flash-1.5).

> The .env.example file only defines NEXT_PUBLIC_DEFAULT_MODEL, the default suggested model.

## Folder Structure

```
app/            # routes (dashboard + /day/[id])
components/
  layout/       # Sidebar, AppShell, ProgressBar
  lesson/       # DayView, VocabularyTable, GrammarBox, MultimediaLinks
  games/        # MatchCardsGame, BugHunter, TechWordle, GameTabs
  ai/           # AITutorChat
  settings/     # ApiKeyModal
  ui/           # Button, Card, Badge, Modal, ScoreRing
data/curriculum.ts   # the 35 days with technical vocabulary
lib/            # store (zustand), openrouter, types, utils
hooks/          # useAITutor, useSpeech
```

## Scripts

- npm run dev - start the development environment
- npm run build - build the application for production
- npm start - serve the production build
