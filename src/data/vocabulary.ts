export type VocabularyWord = {
  english: string;
  italian: string;
  category: string;
}

export const vocabulary: VocabularyWord[] = [
  // Greetings
  { english: "Hello", italian: "Ciao", category: "Greetings" },
  { english: "Good morning", italian: "Buongiorno", category: "Greetings" },
  { english: "Good evening", italian: "Buonasera", category: "Greetings" },
  { english: "Goodbye", italian: "Arrivederci", category: "Greetings" },
  { english: "Please", italian: "Per favore", category: "Greetings" },
  { english: "Thank you", italian: "Grazie", category: "Greetings" },
  { english: "You're welcome", italian: "Prego", category: "Greetings" },
  
  // Numbers
  { english: "One", italian: "Uno", category: "Numbers" },
  { english: "Two", italian: "Due", category: "Numbers" },
  { english: "Three", italian: "Tre", category: "Numbers" },
  { english: "Four", italian: "Quattro", category: "Numbers" },
  { english: "Five", italian: "Cinque", category: "Numbers" },
  { english: "Six", italian: "Sei", category: "Numbers" },
  { english: "Seven", italian: "Sette", category: "Numbers" },
  { english: "Eight", italian: "Otto", category: "Numbers" },
  { english: "Nine", italian: "Nove", category: "Numbers" },
  { english: "Ten", italian: "Dieci", category: "Numbers" },
  
  // Food
  { english: "Water", italian: "Acqua", category: "Food" },
  { english: "Bread", italian: "Pane", category: "Food" },
  { english: "Wine", italian: "Vino", category: "Food" },
  { english: "Coffee", italian: "Caffè", category: "Food" },
  { english: "Pizza", italian: "Pizza", category: "Food" },
  { english: "Pasta", italian: "Pasta", category: "Food" },
  { english: "Ice cream", italian: "Gelato", category: "Food" },
  { english: "Cheese", italian: "Formaggio", category: "Food" },
  { english: "Meat", italian: "Carne", category: "Food" },
  { english: "Fish", italian: "Pesce", category: "Food" },
  
  // Common words
  { english: "Yes", italian: "Sì", category: "Common" },
  { english: "No", italian: "No", category: "Common" },
  { english: "House", italian: "Casa", category: "Common" },
  { english: "Family", italian: "Famiglia", category: "Common" },
  { english: "Friend", italian: "Amico", category: "Common" },
  { english: "Love", italian: "Amore", category: "Common" },
  { english: "Beautiful", italian: "Bello", category: "Common" },
  { english: "Good", italian: "Buono", category: "Common" },
  { english: "Bad", italian: "Cattivo", category: "Common" },
  { english: "Big", italian: "Grande", category: "Common" },
  { english: "Small", italian: "Piccolo", category: "Common" },
  
  // Days
  { english: "Monday", italian: "Lunedì", category: "Days" },
  { english: "Tuesday", italian: "Martedì", category: "Days" },
  { english: "Wednesday", italian: "Mercoledì", category: "Days" },
  { english: "Thursday", italian: "Giovedì", category: "Days" },
  { english: "Friday", italian: "Venerdì", category: "Days" },
  { english: "Saturday", italian: "Sabato", category: "Days" },
  { english: "Sunday", italian: "Domenica", category: "Days" },
];