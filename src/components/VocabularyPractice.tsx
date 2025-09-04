import { useState, useEffect } from 'preact/hooks';
import { vocabulary } from '../data/vocabulary';
import type { VocabularyWord } from '../data/vocabulary';

type LanguagePair = 'english-italian' | 'english-japanese';
type Direction = 'forward' | 'reverse';

export function VocabularyPractice() {
  const [currentWord, setCurrentWord] = useState<VocabularyWord | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [languagePair, setLanguagePair] = useState<LanguagePair>('english-italian');
  const [direction, setDirection] = useState<Direction>('forward');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [practiceMode, setPracticeMode] = useState<'flashcard' | 'typing' | 'multiple-choice'>('multiple-choice');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(vocabulary.map(w => w.category)))];
  
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
  
  const getWordText = (word: VocabularyWord, language: string): string => {
    return word[language as keyof VocabularyWord] as string;
  };

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

  const resetScore = () => {
    setScore({ correct: 0, total: 0 });
    setUsedWords(new Set());
    nextWord();
  };

  useEffect(() => {
    nextWord();
  }, [selectedCategory, languagePair, direction, practiceMode]);

  if (!currentWord) return null;

  return (
    <div className="vocab-container">
      <header className="vocab-header">
        <h1>Language Vocabulary Practice</h1>
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

        <div className="control-group">
          <label>Mode:</label>
          <select 
            value={practiceMode} 
            onChange={(e) => setPracticeMode((e.target as HTMLSelectElement).value as 'flashcard' | 'typing' | 'multiple-choice')}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="flashcard">Flashcard</option>
            <option value="typing">Typing</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="question">
            <span className="label">
              {getLanguages().fromLabel}:
            </span>
            <h2 className="word">
              {getWordText(currentWord, getLanguages().from)}
            </h2>
          </div>

          {practiceMode === 'flashcard' ? (
            <>
              {showAnswer && (
                <div className="answer">
                  <span className="label">
                    {getLanguages().toLabel}:
                  </span>
                  <h2 className="word">
                    {getWordText(currentWord, getLanguages().to)}
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
          ) : practiceMode === 'typing' ? (
            <>
              <div className="input-group">
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
                      The answer is: {getWordText(currentWord, getLanguages().to)}
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
          ) : (
            <>
              <div className="multiple-choice-grid">
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
                    <button
                      key={index}
                      className={buttonClass}
                      onClick={() => handleMultipleChoiceSelection(option)}
                      disabled={feedback !== null}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className="buttons">
                  <button className="btn btn-primary" onClick={nextWord}>
                    Next word →
                  </button>
                </div>
              )}
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