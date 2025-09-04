import { useState, useEffect } from 'preact/hooks';
import { vocabulary } from '../data/vocabulary';
import type { VocabularyWord } from '../data/vocabulary';

export function VocabularyPractice() {
  const [currentWord, setCurrentWord] = useState<VocabularyWord | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isItalianToEnglish, setIsItalianToEnglish] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [practiceMode, setPracticeMode] = useState<'flashcard' | 'typing'>('flashcard');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());

  const categories = ['all', ...Array.from(new Set(vocabulary.map(w => w.category)))];

  const getFilteredWords = () => {
    if (selectedCategory === 'all') return vocabulary;
    return vocabulary.filter(w => w.category === selectedCategory);
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

  const nextWord = () => {
    setCurrentWord(getRandomWord());
    setShowAnswer(false);
    setUserInput('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!currentWord) return;
    
    const expectedAnswer = isItalianToEnglish ? currentWord.english : currentWord.italian;
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

  const resetScore = () => {
    setScore({ correct: 0, total: 0 });
    setUsedWords(new Set());
    nextWord();
  };

  useEffect(() => {
    nextWord();
  }, [selectedCategory, isItalianToEnglish]);

  if (!currentWord) return null;

  return (
    <div className="vocab-container">
      <header className="vocab-header">
        <h1>English-Italian Vocabulary Practice</h1>
        <div className="score">
          Score: {score.correct} / {score.total}
          {score.total > 0 && (
            <span className="percentage">
              ({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
        </div>
      </header>

      <div className="controls">
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
          <label>Direction:</label>
          <button 
            className="toggle-btn"
            onClick={() => setIsItalianToEnglish(!isItalianToEnglish)}
          >
            {isItalianToEnglish ? '🇮🇹 → 🇬🇧' : '🇬🇧 → 🇮🇹'}
          </button>
        </div>

        <div className="control-group">
          <label>Mode:</label>
          <select 
            value={practiceMode} 
            onChange={(e) => setPracticeMode((e.target as HTMLSelectElement).value as 'flashcard' | 'typing')}
          >
            <option value="flashcard">Flashcard</option>
            <option value="typing">Typing</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="question">
            <span className="label">
              {isItalianToEnglish ? 'Italian' : 'English'}:
            </span>
            <h2 className="word">
              {isItalianToEnglish ? currentWord.italian : currentWord.english}
            </h2>
          </div>

          {practiceMode === 'flashcard' ? (
            <>
              {showAnswer && (
                <div className="answer">
                  <span className="label">
                    {isItalianToEnglish ? 'English' : 'Italian'}:
                  </span>
                  <h2 className="word">
                    {isItalianToEnglish ? currentWord.english : currentWord.italian}
                  </h2>
                </div>
              )}

              <div className="buttons">
                {!showAnswer ? (
                  <>
                    <button className="btn btn-success" onClick={handleKnow}>
                      I know it ✓
                    </button>
                    <button className="btn btn-danger" onClick={handleDontKnow}>
                      Show answer
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
              <div className="input-group">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput((e.target as HTMLInputElement).value)}
                  onKeyDown={(e) => e.key === 'Enter' && (feedback ? nextWord() : checkAnswer())}
                  placeholder={`Type the ${isItalianToEnglish ? 'English' : 'Italian'} translation`}
                  disabled={feedback !== null}
                />
              </div>

              {feedback && (
                <div className={`feedback feedback-${feedback}`}>
                  {feedback === 'correct' ? '✓ Correct!' : '✗ Incorrect'}
                  {feedback === 'incorrect' && (
                    <div className="correct-answer">
                      The answer is: {isItalianToEnglish ? currentWord.english : currentWord.italian}
                    </div>
                  )}
                </div>
              )}

              <div className="buttons">
                {!feedback ? (
                  <button className="btn btn-primary" onClick={checkAnswer}>
                    Check Answer
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={nextWord}>
                    Next word →
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <button className="btn btn-reset" onClick={resetScore}>
        Reset Score
      </button>
    </div>
  );
}