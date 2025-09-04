# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- **Development**: `npm run dev` - Start Vite dev server with hot reload
- **Build**: `npm run build` - Type check with TypeScript then build for production
- **Preview**: `npm run preview` - Preview production build locally

## Architecture Overview

This is a **Preact + Vite + TypeScript** language learning application with Tailwind CSS v4 for styling.

### Core Components

- **Main App**: `src/LangApp.tsx` - Single-page language learning application with three practice modes (flashcard, multiple-choice, typing)
- **Data Models**:
  - `src/vocabulary.ts` - Vocabulary data structure with English, Italian, and Japanese translations
  - `src/phrases.ts` - Common phrases in the same three languages
- **Entry Points**:
  - `src/main.tsx` - Preact app initialization
  - `index.html` - HTML template

### Key Features

1. **Practice Modes**:
   - Flashcard: Display word and translation together
   - Multiple Choice: Select correct translation from 4 options
   - Typing: Type the correct translation

2. **Language Support**:
   - English ↔ Italian
   - English ↔ Japanese
   - Bidirectional practice (forward/reverse)

3. **Content Categories**: Vocabulary and phrases organized by categories (Greetings, Numbers, Food, Verbs, etc.)

4. **Speech Synthesis**: Browser-based TTS for pronunciation practice

### Development Notes

- The app uses Preact (lightweight React alternative) with hooks
- Styling combines Tailwind CSS v4 utilities with custom CSS in `src/index.css`
- No test framework configured yet
- No linting or formatting tools configured
- State management is local component state (no Redux/Context)
- TypeScript strict mode is enabled