import { useState, useEffect } from 'preact/hooks';
import { vocabulary } from './vocabulary';
import type { VocabularyWord } from './vocabulary';
import { phrases } from './phrases';
import type { Phrase } from './phrases';

type LanguagePair = 'english-italian' | 'english-japanese';
type Direction = 'forward' | 'reverse';
type ContentType = 'vocabulary' | 'phrases';
type WordOrPhrase = VocabularyWord | Phrase;

export function LangApp() {
  const [currentWord, setCurrentWord] = useState<WordOrPhrase | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [languagePair, setLanguagePair] = useState<LanguagePair>('english-italian');
  const [direction, setDirection] = useState<Direction>('forward');
  const [contentType, setContentType] = useState<ContentType>('vocabulary');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [practiceMode, setPracticeMode] = useState<'flashcard' | 'typing' | 'multiple-choice'>('multiple-choice');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getCurrentData = () => {
    return contentType === 'vocabulary' ? vocabulary : phrases;
  };

  const categories = ['all', ...Array.from(new Set(getCurrentData().map(w => w.category)))];
  
  const getLanguages = () => {
    if (languagePair === 'english-italian') {
      return direction === 'forward' 
        ? { from: 'english', to: 'italian', fromLabel: 'English', toLabel: 'Italian', fromFlag: '🇬🇧', toFlag: '🇮🇹' }
        : { from: 'italian', to: 'english', fromLabel: 'Italian', toLabel: 'English', fromFlag: '🇮🇹', toFlag: '🇬🇧' };
    } else {
      return direction === 'forward'
        ? { from: 'english', to: 'japanese', fromLabel: 'English', toLabel: 'Japanese', fromFlag: '🇬🇧', toFlag: '🇯🇵' }
        : { from: 'japanese', to: 'english', fromLabel: 'Japanese', toLabel: 'English', fromFlag: '🇯🇵', toFlag: '🇬🇧' };
    }
  };
  
  const getWordText = (word: WordOrPhrase, language: string): string => {
    return word[language as keyof WordOrPhrase] as string;
  };

  const getFilteredWords = () => {
    const data = getCurrentData();
    if (selectedCategory === 'all') return data;
    return data.filter(w => w.category === selectedCategory);
  };

  const getRandomWord = () => {
    const words = getFilteredWords();
    if (usedWords.size >= words.length) {
      setUsedWords(new Set());
    }
    
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * words.length);
    } while (usedWords.has(randomIndex) && usedWords.size < words.length);
    
    setUsedWords(prev => new Set([...prev, randomIndex]));
    return words[randomIndex];
  };

  const generateMultipleChoiceOptions = (correctWord: VocabularyWord) => {
    const langs = getLanguages();
    const correctAnswer = getWordText(correctWord, langs.to);
    const allWords = getFilteredWords().filter(w => w !== correctWord);
    
    // Get 3 random incorrect options
    const incorrectOptions: string[] = [];
    const usedIndices = new Set<number>();
    
    while (incorrectOptions.length < 3 && incorrectOptions.length < allWords.length) {
      const randomIndex = Math.floor(Math.random() * allWords.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const wrongAnswer = getWordText(allWords[randomIndex], langs.to);
        if (wrongAnswer !== correctAnswer) {
          incorrectOptions.push(wrongAnswer);
        }
      }
    }
    
    // Combine correct answer with incorrect options and shuffle
    const allOptions = [correctAnswer, ...incorrectOptions];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    return allOptions;
  };

  const nextWord = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setShowAnswer(false);
    setUserInput('');
    setFeedback(null);
    setSelectedOption(null);
    
    if (practiceMode === 'multiple-choice' && newWord) {
      setMultipleChoiceOptions(generateMultipleChoiceOptions(newWord));
    }
  };

  const checkAnswer = () => {
    if (!currentWord) return;
    
    const langs = getLanguages();
    const expectedAnswer = getWordText(currentWord, langs.to);
    const isCorrect = userInput.toLowerCase().trim() === expectedAnswer.toLowerCase();
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    if (!isCorrect) {
      setShowAnswer(true);
    }
  };

  const handleMultipleChoiceSelection = (option: string) => {
    if (feedback) return; // Already answered
    
    setSelectedOption(option);
    const langs = getLanguages();
    const correctAnswer = getWordText(currentWord!, langs.to);
    const isCorrect = option === correctAnswer;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    if (!isCorrect) {
      setShowAnswer(true);
    }
  };

  const handleKnow = () => {
    setScore(prev => ({
      correct: prev.correct + 1,
      total: prev.total + 1
    }));
    nextWord();
  };

  const handleDontKnow = () => {
    setScore(prev => ({
      correct: prev.correct,
      total: prev.total + 1
    }));
    setShowAnswer(true);
  };

  const handleSkip = () => {
    nextWord();
  };

  const speakText = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language codes
      switch (language) {
        case 'english':
          utterance.lang = 'en-US';
          break;
        case 'italian':
          utterance.lang = 'it-IT';
          break;
        case 'japanese':
          utterance.lang = 'ja-JP';
          break;
        default:
          utterance.lang = 'en-US';
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const resetScore = () => {
    setScore({ correct: 0, total: 0 });
    setUsedWords(new Set());
    nextWord();
  };

  useEffect(() => {
    nextWord();
  }, [selectedCategory, languagePair, direction, practiceMode, contentType]);

  if (!currentWord) return null;

  return (
    <div className="bg-white max-md:h-full md:rounded-2xl p-4 shadow-2xl max-w-4xl mx-auto">
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">minilingoo</h1>
      </header>

      <div className="flex flex-col gap-1">
        <div className="segmented-control mb-2">
          <button 
            className={`segment ${practiceMode === 'flashcard' ? 'active' : ''}`}
            onClick={() => setPracticeMode('flashcard')}
          >
            Flashcard
          </button>
          <button 
            className={`segment ${practiceMode === 'multiple-choice' ? 'active' : ''}`}
            onClick={() => setPracticeMode('multiple-choice')}
          >
            Choice
          </button>
          <button 
            className={`segment ${practiceMode === 'typing' ? 'active' : ''}`}
            onClick={() => setPracticeMode('typing')}
          >
            Typing
          </button>
        </div>

        <div className="control-group">
          <label>Content:</label>
          <select
            value={contentType}
            onChange={(e) => {
              setContentType((e.target as HTMLSelectElement).value as ContentType);
              setSelectedCategory('all'); // Reset category when switching content type
            }}
          >
            <option value="vocabulary">📝 Vocabulary</option>
            <option value="phrases">💬 Phrases</option>
          </select>
        </div>

        <div className="control-group">
          <label>Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory((e.target as HTMLSelectElement).value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Language:</label>
          <select
            value={languagePair}
            onChange={(e) => setLanguagePair((e.target as HTMLSelectElement).value as LanguagePair)}
          >
            <option value="english-italian">🇬🇧 English - Italian 🇮🇹</option>
            <option value="english-japanese">🇬🇧 English - Japanese 🇯🇵</option>
          </select>
        </div>

        <div className="control-group">
          <label>Direction:</label>
          <button 
            className="toggle-btn"
            onClick={() => setDirection(direction === 'forward' ? 'reverse' : 'forward')}
          >
            {(() => {
              const langs = getLanguages();
              return `${langs.fromFlag} → ${langs.toFlag}`;
            })()}
          </button>
        </div>
      </div>

      <div className="mt-2 card">
        <div className="card-content">
          <div className="question">
            <span className="label">
              {getLanguages().fromLabel}:
            </span>
            <div className="word-with-speak">
              <h2 className="word">
                {getWordText(currentWord, getLanguages().from)}
              </h2>
              <button 
                className="btn-speak"
                onClick={() => speakText(getWordText(currentWord, getLanguages().from), getLanguages().from)}
                title="Speak"
              >
                🔊
              </button>
            </div>
          </div>

          {practiceMode === 'flashcard' ? (
            <>
              <div className="answer">
                <span className="label">
                  {getLanguages().toLabel}:
                </span>
                <div className="word-with-speak">
                  <h2 className="word">
                    {getWordText(currentWord, getLanguages().to)}
                  </h2>
                  <button 
                    className="btn-speak"
                    onClick={() => speakText(getWordText(currentWord, getLanguages().to), getLanguages().to)}
                    title="Speak"
                  >
                    🔊
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <button className="btn btn-primary" onClick={handleSkip}>
                  Next →
                </button>
              </div>
            </>
          ) : practiceMode === 'typing' ? (
            <>
              <div className="mb-6">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput((e.target as HTMLInputElement).value)}
                  onKeyDown={(e) => e.key === 'Enter' && (feedback ? nextWord() : checkAnswer())}
                  placeholder={`Type the ${getLanguages().toLabel} translation`}
                  disabled={feedback !== null}
                />
              </div>

              {feedback && (
                <div className={`feedback feedback-${feedback}`}>
                  {feedback === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
                  {feedback === 'incorrect' && (
                    <div className="correct-answer">
                      <span>The answer is: {getWordText(currentWord, getLanguages().to)}</span>
                      <button 
                        className="btn-speak btn-speak-inline"
                        onClick={() => speakText(getWordText(currentWord, getLanguages().to), getLanguages().to)}
                        title="Speak"
                      >
                        🔊
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                {!feedback ? (
                  <>
                    <button className="btn btn-primary" onClick={checkAnswer}>
                      Check Answer
                    </button>
                    <button className="btn btn-skip" onClick={handleSkip}>
                      Next →
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={nextWord}>
                    Next word →
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {multipleChoiceOptions.map((option, index) => {
                  const correctAnswer = getWordText(currentWord, getLanguages().to);
                  const isCorrectOption = option === correctAnswer;
                  const isSelected = option === selectedOption;
                  
                  let buttonClass = 'btn-choice';
                  if (feedback) {
                    if (isCorrectOption) {
                      buttonClass += ' correct';
                    } else if (isSelected && !isCorrectOption) {
                      buttonClass += ' incorrect';
                    }
                  }
                  
                  return (
                    <div key={index} className="relative">
                      <button
                        className={buttonClass}
                        onClick={() => handleMultipleChoiceSelection(option)}
                        disabled={feedback !== null}
                      >
                        {option}
                      </button>
                      <button 
                        className="btn-speak btn-speak-choice"
                        onClick={() => speakText(option, getLanguages().to)}
                        title="Speak"
                      >
                        🔊
                      </button>
                    </div>
                  );
                })}
              </div>

              {!feedback && (
                <div className="flex justify-center">
                  <button className="btn btn-skip" onClick={handleSkip}>
                    Next →
                  </button>
                </div>
              )}

              {feedback && (
                <div className="flex justify-center">
                  <button className="btn btn-primary" onClick={nextWord}>
                    Next word →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
