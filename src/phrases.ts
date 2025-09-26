import { basicPhrases } from './data/phrases/basic.ts';
import { restaurantPhrases } from './data/phrases/restaurant.ts';
import { travelPhrases } from './data/phrases/travel.ts';
import { shoppingPhrases } from './data/phrases/shopping.ts';
import { emergencyPhrases } from './data/phrases/emergency.ts';
import { healthPhrases } from './data/phrases/health.ts';
import { weatherPhrases } from './data/phrases/weather.ts';
import { technologyPhrases } from './data/phrases/technology.ts';
import { transportationPhrases } from './data/phrases/transportation.ts';
import { moneyPhrases } from './data/phrases/money.ts';
import { directionsPhrases } from './data/phrases/directions.ts';

export type Phrase = {
  english: string;
  italian: string;
  japanese: string;
  czech: string;
  portuguese: string;
  spanish: string;
  german: string;
  category: string;
};

export const phrases: Phrase[] = [
  ...basicPhrases,
  ...restaurantPhrases,
  ...travelPhrases,
  ...shoppingPhrases,
  ...emergencyPhrases,
  ...healthPhrases,
  ...weatherPhrases,
  ...technologyPhrases,
  ...transportationPhrases,
  ...moneyPhrases,
  ...directionsPhrases,
];
