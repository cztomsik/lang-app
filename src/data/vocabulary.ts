export type VocabularyWord = {
  english: string;
  italian: string;
  japanese: string;
  category: string;
}

export const vocabulary: VocabularyWord[] = [
  // Greetings
  { english: "Hello", italian: "Ciao", japanese: "こんにちは [konnichiwa]", category: "Greetings" },
  { english: "Good morning", italian: "Buongiorno", japanese: "おはよう [ohayou]", category: "Greetings" },
  { english: "Good evening", italian: "Buonasera", japanese: "こんばんは [konbanwa]", category: "Greetings" },
  { english: "Goodbye", italian: "Arrivederci", japanese: "さようなら [sayounara]", category: "Greetings" },
  { english: "Please", italian: "Per favore", japanese: "お願いします [onegaishimasu]", category: "Greetings" },
  { english: "Thank you", italian: "Grazie", japanese: "ありがとう [arigatou]", category: "Greetings" },
  { english: "You're welcome", italian: "Prego", japanese: "どういたしまして [douitashimashite]", category: "Greetings" },
  
  // Numbers
  { english: "One", italian: "Uno", japanese: "一 [ichi]", category: "Numbers" },
  { english: "Two", italian: "Due", japanese: "二 [ni]", category: "Numbers" },
  { english: "Three", italian: "Tre", japanese: "三 [san]", category: "Numbers" },
  { english: "Four", italian: "Quattro", japanese: "四 [yon/shi]", category: "Numbers" },
  { english: "Five", italian: "Cinque", japanese: "五 [go]", category: "Numbers" },
  { english: "Six", italian: "Sei", japanese: "六 [roku]", category: "Numbers" },
  { english: "Seven", italian: "Sette", japanese: "七 [nana/shichi]", category: "Numbers" },
  { english: "Eight", italian: "Otto", japanese: "八 [hachi]", category: "Numbers" },
  { english: "Nine", italian: "Nove", japanese: "九 [kyuu/ku]", category: "Numbers" },
  { english: "Ten", italian: "Dieci", japanese: "十 [juu]", category: "Numbers" },
  
  // Food
  { english: "Water", italian: "Acqua", japanese: "水 [mizu]", category: "Food" },
  { english: "Bread", italian: "Pane", japanese: "パン [pan]", category: "Food" },
  { english: "Wine", italian: "Vino", japanese: "ワイン [wain]", category: "Food" },
  { english: "Coffee", italian: "Caffè", japanese: "コーヒー [koohii]", category: "Food" },
  { english: "Pizza", italian: "Pizza", japanese: "ピザ [piza]", category: "Food" },
  { english: "Pasta", italian: "Pasta", japanese: "パスタ [pasuta]", category: "Food" },
  { english: "Ice cream", italian: "Gelato", japanese: "アイスクリーム [aisu kuriimu]", category: "Food" },
  { english: "Cheese", italian: "Formaggio", japanese: "チーズ [chiizu]", category: "Food" },
  { english: "Meat", italian: "Carne", japanese: "肉 [niku]", category: "Food" },
  { english: "Fish", italian: "Pesce", japanese: "魚 [sakana]", category: "Food" },
  
  // Common words
  { english: "Yes", italian: "Sì", japanese: "はい [hai]", category: "Common" },
  { english: "No", italian: "No", japanese: "いいえ [iie]", category: "Common" },
  { english: "House", italian: "Casa", japanese: "家 [ie]", category: "Common" },
  { english: "Family", italian: "Famiglia", japanese: "家族 [kazoku]", category: "Common" },
  { english: "Friend", italian: "Amico", japanese: "友達 [tomodachi]", category: "Common" },
  { english: "Love", italian: "Amore", japanese: "愛 [ai]", category: "Common" },
  { english: "Beautiful", italian: "Bello", japanese: "美しい [utsukushii]", category: "Common" },
  { english: "Good", italian: "Buono", japanese: "良い [yoi/ii]", category: "Common" },
  { english: "Bad", italian: "Cattivo", japanese: "悪い [warui]", category: "Common" },
  { english: "Big", italian: "Grande", japanese: "大きい [ookii]", category: "Common" },
  { english: "Small", italian: "Piccolo", japanese: "小さい [chiisai]", category: "Common" },
  
  // Days
  { english: "Monday", italian: "Lunedì", japanese: "月曜日 [getsuyoubi]", category: "Days" },
  { english: "Tuesday", italian: "Martedì", japanese: "火曜日 [kayoubi]", category: "Days" },
  { english: "Wednesday", italian: "Mercoledì", japanese: "水曜日 [suiyoubi]", category: "Days" },
  { english: "Thursday", italian: "Giovedì", japanese: "木曜日 [mokuyoubi]", category: "Days" },
  { english: "Friday", italian: "Venerdì", japanese: "金曜日 [kinyoubi]", category: "Days" },
  { english: "Saturday", italian: "Sabato", japanese: "土曜日 [doyoubi]", category: "Days" },
  { english: "Sunday", italian: "Domenica", japanese: "日曜日 [nichiyoubi]", category: "Days" },
];