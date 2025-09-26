import { greetingsWords } from './data/vocabulary/greetings.ts';
import { numbersWords } from './data/vocabulary/numbers.ts';
import { foodWords } from './data/vocabulary/food.ts';
import { commonWords } from './data/vocabulary/common.ts';
import { daysWords } from './data/vocabulary/days.ts';
import { verbsWords } from './data/vocabulary/verbs.ts';
import { questionsWords } from './data/vocabulary/questions.ts';
import { timeWords } from './data/vocabulary/time.ts';
import { familyWords } from './data/vocabulary/family.ts';
import { colorsWords } from './data/vocabulary/colors.ts';
import { grammarWords } from './data/vocabulary/grammar.ts';
import { bodyWords } from './data/vocabulary/body.ts';
import { weatherWords } from './data/vocabulary/weather.ts';
import { technologyWords } from './data/vocabulary/technology.ts';
import { transportationWords } from './data/vocabulary/transportation.ts';
import { moneyWords } from './data/vocabulary/money.ts';
import { directionsWords } from './data/vocabulary/directions.ts';
import { placesWords } from './data/vocabulary/places.ts';
import { emotionsWords } from './data/vocabulary/emotions.ts';

export type VocabularyWord = {
  english: string;
  italian: string;
  japanese: string;
  czech: string;
  portuguese: string;
  spanish: string;
  german: string;
  category: string;
};

export const vocabulary: VocabularyWord[] = [
  ...greetingsWords,
  ...numbersWords,
  ...foodWords,
  ...commonWords,
  ...daysWords,
  ...verbsWords,
  ...questionsWords,
  ...timeWords,
  ...familyWords,
  ...colorsWords,
  ...grammarWords,
  ...bodyWords,
  ...weatherWords,
  ...technologyWords,
  ...transportationWords,
  ...moneyWords,
  ...directionsWords,
  ...placesWords,
  ...emotionsWords,
];

/*
// Original vocabulary data has been split into category files:
// - data/vocabulary/greetings.ts
// - data/vocabulary/numbers.ts
// - data/vocabulary/food.ts
// - data/vocabulary/common.ts
// - data/vocabulary/days.ts
// - data/vocabulary/verbs.ts
// - data/vocabulary/questions.ts
// - data/vocabulary/time.ts
// - data/vocabulary/family.ts
// - data/vocabulary/colors.ts
// - data/vocabulary/grammar.ts
// - data/vocabulary/body.ts
// - data/vocabulary/weather.ts
// - data/vocabulary/technology.ts
// - data/vocabulary/transportation.ts
// - data/vocabulary/money.ts
// - data/vocabulary/directions.ts
// - data/vocabulary/places.ts
// - data/vocabulary/emotions.ts
*/
