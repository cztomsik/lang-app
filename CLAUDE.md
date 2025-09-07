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
  - `src/vocabulary.ts` - Vocabulary data structure with multi-language support (imports from category files)
  - `src/phrases.ts` - Common phrases in multiple languages (imports from category files)
  - `src/data/vocabulary/` - Vocabulary organized by 19 categories (greetings, numbers, food, common, days, verbs, questions, time, family, colors, grammar, body, weather, technology, transportation, money, directions, places, emotions)
  - `src/data/phrases/` - Phrases organized by 11 categories (basic, restaurant, travel, shopping, emergency, health, weather, technology, transportation, money, directions)
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

### Data Organization

The vocabulary and phrases data has been refactored into modular category-based files for better maintainability:

**Vocabulary Categories** (`src/data/vocabulary/`):

- `greetings.ts` - Basic greetings and politeness
- `numbers.ts` - Numbers 1-10
- `food.ts` - Food and drinks
- `common.ts` - Common adjectives and basic words
- `days.ts` - Days of the week
- `verbs.ts` - Essential verbs
- `questions.ts` - Question words
- `time.ts` - Time expressions
- `family.ts` - Family relationships
- `colors.ts` - Colors
- `grammar.ts` - Grammar words, pronouns, prepositions
- `body.ts` - Body parts
- `weather.ts` - Weather conditions and seasons
- `technology.ts` - Technology terms
- `transportation.ts` - Vehicles and transport
- `money.ts` - Money and banking
- `directions.ts` - Navigation and directions
- `places.ts` - Common locations
- `emotions.ts` - Feelings and emotions

**Phrase Categories** (`src/data/phrases/`):

- `basic.ts` - Basic common phrases
- `restaurant.ts` - Dining and food service
- `travel.ts` - Travel and booking
- `shopping.ts` - Shopping and retail
- `emergency.ts` - Emergency situations
- `health.ts` - Health and medical
- `weather.ts` - Weather-related
- `technology.ts` - Technology and devices
- `transportation.ts` - Getting around
- `money.ts` - Money and payments
- `directions.ts` - Navigation and directions

All category files maintain full backward compatibility through the main `vocabulary.ts` and `phrases.ts` files which import and re-export all categories.

### Development Notes

- The app uses Preact (lightweight React alternative) with hooks
- Styling combines Tailwind CSS v4 utilities with custom CSS in `src/index.css`
- No test framework configured yet
- Prettier configured for code formatting
- State management combines local component state with localStorage persistence via custom hooks
- TypeScript strict mode is enabled
- Components follow a modular structure with barrel exports from `components/index.ts`
