# Language Learning App Documentation

This is a **smart language learning application** built with Preact, TypeScript, and Tailwind CSS that helps users learn vocabulary and phrases through adaptive practice with intelligent spaced repetition.

## App Overview

### What is this app?
A modern, web-based language learning tool that adapts to your learning patterns. Unlike traditional spaced repetition systems that force scheduled reviews, this app intelligently prioritizes words you struggle with while letting you practice at your own pace.

### Key Features
1. **🎯 Adaptive Word Selection**: Harder words appear more frequently without rigid scheduling
2. **📊 Visual Progress Tracking**: Color-coded strength indicators and detailed statistics
3. **🗂️ Category-Based Learning**: Organized vocabulary and phrases by topic
4. **🔄 Multiple Practice Modes**: Learn, Answer (typing), and Guess (multiple choice)
5. **🌍 Multi-Language Support**: 6+ languages with bidirectional practice
6. **🔊 Speech Synthesis**: Built-in pronunciation practice
7. **💾 Persistent Progress**: All progress saved locally across sessions

---

## Technical Documentation

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

---

## Feature Implementation Details

### 🎯 Intelligent Spaced Repetition System

**Location**: `src/spacedRepetition.ts`, `src/hooks/useSpacedRepetition.ts`

**How it works**:
- **No time-based scheduling** - practice when you want, not when forced
- **Adaptive difficulty weighting** - words with lower `easeFactor` (harder for you) appear more frequently
- **Quality-based learning** - performance affects word difficulty and future appearance rate
- **Progress tracking** - tracks repetitions and strength (easeFactor) per word per language pair

**Key Functions**:
- `updateWordProgress()` - Updates word difficulty based on your performance (0-5 quality scale)
- `calculateWordStrength()` - Converts easeFactor (1.3-2.5+) to user-friendly strength percentage (0-100%)
- `getRandomWord()` with weighted selection - Harder words get higher probability of selection

### 📊 Visual Progress System

**Location**: `src/components/ProgressDisplay.tsx`, word display in `src/LangApp.tsx`

**Features**:
1. **Individual Word Indicators**:
   - Color-coded strength badges (Red <30%, Yellow 30-69%, Green 70%+)
   - Repetition count tracking
   - Mini progress bars with gradient colors
   
2. **Category Statistics**:
   - Overall stats: Total, Mastered (3+ reps), Learning (1-2 reps), New (0 reps)
   - Category-specific breakdowns when category selected
   - Average strength calculation per category

3. **Dynamic UI Updates**:
   - Progress display title changes: "Greetings Progress" vs "Your Progress"
   - Grid layout adjusts (4 or 5 columns) based on whether category avg strength is shown

### 🔄 Practice Modes

**Location**: `src/LangApp.tsx` (modes), `src/hooks/useAppState.ts` (state)

1. **Learn Mode**: 
   - Shows word and translation simultaneously
   - Quality score: 3 (neutral learning)
   - Use: Initial exposure to new words

2. **Answer Mode**: 
   - Type the translation
   - Quality score: 4 (correct) or 1 (incorrect)
   - Use: Active recall practice

3. **Guess Mode**: 
   - Multiple choice (4 options)
   - Quality score: 4 (correct) or 1 (incorrect)
   - Use: Recognition practice

### 🌍 Multi-Language Architecture

**Location**: Language handling throughout `src/LangApp.tsx`

**Supported Languages**: English, Italian, Japanese, Czech, Portuguese, Spanish

**Features**:
- **Bidirectional practice** - learn any direction (e.g., English→Italian or Italian→English)
- **Speech synthesis** with language-specific voice selection
- **Separate progress tracking** per language pair and content type
- **LocalStorage keys**: `sr_progress_{contentType}_{fromLanguage}_{toLanguage}`

### 💾 Data Storage & State Management

**Location**: `src/hooks/useLocalStorage.ts`, `src/hooks/useSpacedRepetition.ts`

**Storage Strategy**:
- **LocalStorage** for all persistence (no server required)
- **Separate progress per language pair** - English→Italian progress independent of Italian→English
- **Category-aware storage** - progress includes category information for filtering
- **JSON serialization** of WordProgress objects with easeFactor, repetitions, etc.

**Data Structure**:
```typescript
interface WordProgress {
  wordId: string;           // "hello_greetings" 
  category: string;         // "greetings"
  fromLanguage: string;     // "english"
  toLanguage: string;       // "italian"
  easeFactor: number;       // 1.3-2.5+ (difficulty)
  repetitions: number;      // 0, 1, 2, 3+ (mastery level)
}
```

### 🗂️ Content Organization

**Location**: `src/data/vocabulary/`, `src/data/phrases/`

**Structure**:
- **Modular category files** - each category in separate TypeScript file
- **Consistent schema** - all words have same structure across languages
- **Barrel exports** - main `vocabulary.ts` and `phrases.ts` re-export everything
- **Type safety** - Full TypeScript coverage with `VocabularyWord` and `Phrase` types

**Categories**:
- **19 vocabulary categories** (greetings, numbers, food, verbs, etc.)
- **11 phrase categories** (basic, restaurant, travel, emergency, etc.)
- **Easy to extend** - just add new category file and update main export

### Development Notes

- The app uses Preact (lightweight React alternative) with hooks
- **Uses Preact's native `class` prop instead of React's `className`** - all components use `class` for CSS classes
- **Always use arrow functions in JSX event handlers** - use `onClick={() => handleClick()}` instead of `onClick={handleClick}`
- Styling combines Tailwind CSS v4 utilities with custom CSS in `src/index.css`
- No test framework configured yet
- Prettier configured for code formatting
- State management combines local component state with localStorage persistence via custom hooks
- TypeScript strict mode is enabled
- Components follow a modular structure with barrel exports from `components/index.ts`

---

## User Experience Flow

### How the App Adapts to Learning

1. **First Time**: New words appear randomly, building initial familiarity
2. **After Practice**: Algorithm learns your strengths/weaknesses per word
3. **Ongoing Use**: Harder words (low easeFactor) appear more frequently automatically
4. **Progress Visualization**: Color-coded feedback shows improvement over time

### Typical User Journey

1. **Setup**: Choose languages (e.g., English → Italian), select content type (vocabulary/phrases)
2. **Category Selection**: Pick topic area (greetings, food, etc.) or practice all
3. **Practice Mode**: Choose learning style (learn/answer/guess)
4. **Adaptive Practice**: App intelligently selects words based on your performance
5. **Progress Tracking**: View stats overall or per category to identify areas to focus

### Smart Features in Action

- **Weighted Selection**: If you struggle with "ciao" (easeFactor drops to 1.5), it appears ~2x more than "grazie" (easeFactor 2.3)
- **Visual Feedback**: Struggling words show red strength indicators, improving words turn yellow then green
- **Category Insights**: See you're 85% strong in greetings but only 45% in verbs - practice accordingly
- **No Pressure**: Practice when you want, no "due cards" or rigid schedules

### Technical Architecture Summary

This is a **client-side only** application (no backend needed) that uses:
- **Preact** for lightweight, React-like UI components
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** for utility-first styling with custom design system
- **Vite** for fast development and optimized production builds
- **LocalStorage** for persistent progress without requiring accounts or servers

The architecture prioritizes **simplicity**, **performance**, and **user agency** - you control your learning pace while the app intelligently adapts to help you improve efficiently.
