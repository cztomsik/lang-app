# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- **Development**: `npm run dev` - Start Vite dev server with hot reload
- **Build**: `npm run build` - Type check with TypeScript then build for production
- **Preview**: `npm run preview` - Preview production build locally
- **Format**: `npm run format` - Format code with Prettier
- **Type Check**: `npm run check` - Run TypeScript type checking without emitting files

## Architecture Overview

This is a **Preact + Vite + TypeScript** language learning application with Tailwind CSS v4 for styling.

### Core Components

- **Main App**: `src/LangApp.tsx` - Single-page language learning application with three practice modes (learn, answer, guess/multiple-choice)
- **Components**: `src/components/` - Reusable UI components exported from `components/index.ts`
- **Hooks**: `src/hooks/useLocalStorage.ts` - Custom hook for persistent state management with localStorage
- **Data Models**:
  - `src/vocabulary.ts` - Vocabulary data structure with multi-language support
  - `src/phrases.ts` - Common phrases in multiple languages
- **Entry Points**:
  - `src/main.tsx` - Preact app initialization
  - `index.html` - HTML template

### Key Features

1. **Practice Modes**:
   - Learn: Display word and translation together (flashcard style)
   - Answer: Type the correct translation (typing mode)
   - Guess: Select correct translation from multiple choice options

2. **Language Support**:
   - Multiple languages including English, Italian, Japanese, Czech, Portuguese, Spanish
   - Bidirectional practice (forward/reverse translation)
   - Persistent language selection using localStorage

3. **Content Categories**: Vocabulary and phrases organized by categories (Greetings, Numbers, Food, Verbs, etc.)

4. **Speech Synthesis**: Browser-based TTS for pronunciation practice

### Development Notes

- The app uses Preact (lightweight React alternative) with hooks
- Styling combines Tailwind CSS v4 utilities with custom CSS in `src/index.css`
- No test framework configured yet
- Prettier configured for code formatting
- State management combines local component state with localStorage persistence via custom hooks
- TypeScript strict mode is enabled
- Components follow a modular structure with barrel exports from `components/index.ts`
