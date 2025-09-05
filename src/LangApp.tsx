import { useState, useEffect } from 'preact/hooks';
import { vocabulary } from './vocabulary';
import type { VocabularyWord } from './vocabulary';
import { phrases } from './phrases';
import type { Phrase } from './phrases';
import {
  Button,
  Card,
  WordDisplay,
  Select,
  SegmentedControl,
  ControlGroup,
  ToggleButton,
  Input,
  Feedback,
  ChoiceButton,
} from './components';

type LanguagePair = 'english-italian' | 'english-japanese' | 'english-czech' | 'english-portuguese' | 'czech-portuguese';
type Direction = 'forward' | 'reverse';
type ContentType = 'vocabulary' | 'phrases';
type WordOrPhrase = VocabularyWord | Phrase;

export function LangApp() {
  const [currentWord, setCurrentWord] = useState<WordOrPhrase | null>(null);
  const [, setShowAnswer] = useState(false);
  const [languagePair, setLanguagePair] =
    useState<LanguagePair>('english-italian');
  const [direction, setDirection] = useState<Direction>('forward');
  const [contentType, setContentType] = useState<ContentType>('vocabulary');
  const [, setScore] = useState({ correct: 0, total: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(
    null
  );
  const [practiceMode, setPracticeMode] = useState<
    'flashcard' | 'typing' | 'multiple-choice'
  >('multiple-choice');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>(
    []
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getCurrentData = () => {
    return contentType === 'vocabulary' ? vocabulary : phrases;
  };

  const categories = [
    'all',
    ...Array.from(new Set(getCurrentData().map((w) => w.category))),
  ];

  const getLanguages = () => {
    if (languagePair === 'english-italian') {
      return direction === 'forward'
        ? {
            from: 'english',
            to: 'italian',
            fromLabel: 'English',
            toLabel: 'Italian',
            fromFlag: '🇬🇧',
            toFlag: '🇮🇹',
          }
        : {
            from: 'italian',
            to: 'english',
            fromLabel: 'Italian',
            toLabel: 'English',
            fromFlag: '🇮🇹',
            toFlag: '🇬🇧',
          };
    } else if (languagePair === 'english-japanese') {
      return direction === 'forward'
        ? {
            from: 'english',
            to: 'japanese',
            fromLabel: 'English',
            toLabel: 'Japanese',
            fromFlag: '🇬🇧',
            toFlag: '🇯🇵',
          }
        : {
            from: 'japanese',
            to: 'english',
            fromLabel: 'Japanese',
            toLabel: 'English',
            fromFlag: '🇯🇵',
            toFlag: '🇬🇧',
          };
    } else if (languagePair === 'english-czech') {
      return direction === 'forward'
        ? {
            from: 'english',
            to: 'czech',
            fromLabel: 'English',
            toLabel: 'Czech',
            fromFlag: '🇬🇧',
            toFlag: '🇨🇿',
          }
        : {
            from: 'czech',
            to: 'english',
            fromLabel: 'Czech',
            toLabel: 'English',
            fromFlag: '🇨🇿',
            toFlag: '🇬🇧',
          };
    } else if (languagePair === 'english-portuguese') {
      return direction === 'forward'
        ? {
            from: 'english',
            to: 'portuguese',
            fromLabel: 'English',
            toLabel: 'Portuguese',
            fromFlag: '🇬🇧',
            toFlag: '🇵🇹',
          }
        : {
            from: 'portuguese',
            to: 'english',
            fromLabel: 'Portuguese',
            toLabel: 'English',
            fromFlag: '🇵🇹',
            toFlag: '🇬🇧',
          };
    } else { // czech-portuguese
      return direction === 'forward'
        ? {
            from: 'czech',
            to: 'portuguese',
            fromLabel: 'Czech',
            toLabel: 'Portuguese',
            fromFlag: '🇨🇿',
            toFlag: '🇵🇹',
          }
        : {
            from: 'portuguese',
            to: 'czech',
            fromLabel: 'Portuguese',
            toLabel: 'Czech',
            fromFlag: '🇵🇹',
            toFlag: '🇨🇿',
          };
    }
  };

  const getWordText = (word: WordOrPhrase, language: string): string => {
    return word[language as keyof WordOrPhrase] as string;
  };

  const getFilteredWords = () => {
    const data = getCurrentData();
    if (selectedCategory === 'all') return data;
    return data.filter((w) => w.category === selectedCategory);
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

    setUsedWords((prev) => new Set([...prev, randomIndex]));
    return words[randomIndex];
  };

  const generateMultipleChoiceOptions = (correctWord: VocabularyWord) => {
    const langs = getLanguages();
    const correctAnswer = getWordText(correctWord, langs.to);
    const allWords = getFilteredWords().filter((w) => w !== correctWord);

    // Get 3 random incorrect options
    const incorrectOptions: string[] = [];
    const usedIndices = new Set<number>();

    while (
      incorrectOptions.length < 3 &&
      incorrectOptions.length < allWords.length
    ) {
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
    const isCorrect =
      userInput.toLowerCase().trim() === expectedAnswer.toLowerCase();

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
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
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    if (!isCorrect) {
      setShowAnswer(true);
    }
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
        case 'czech':
          utterance.lang = 'cs-CZ';
          break;
        case 'portuguese':
          utterance.lang = 'pt-PT';
          break;
        default:
          utterance.lang = 'en-US';
      }

      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    nextWord();
  }, [selectedCategory, languagePair, direction, practiceMode, contentType]);

  if (!currentWord) return null;

  const langs = getLanguages();

  return (
    <div className="bg-white max-md:h-full md:rounded-2xl p-4 shadow-2xl max-w-4xl mx-auto">
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">minilingoo</h1>
      </header>

      <div className="flex flex-col gap-1">
        <SegmentedControl
          value={practiceMode}
          onChange={(value) => setPracticeMode(value as any)}
          options={[
            { value: 'flashcard', label: 'Flashcard' },
            { value: 'multiple-choice', label: 'Choice' },
            { value: 'typing', label: 'Typing' },
          ]}
        />

        <Select
          label="Content"
          value={contentType}
          onChange={(value) => {
            setContentType(value as ContentType);
            setSelectedCategory('all');
          }}
          options={[
            { value: 'vocabulary', label: '📝 Vocabulary' },
            { value: 'phrases', label: '💬 Phrases' },
          ]}
        />

        <Select
          label="Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categories.map((cat) => ({
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1),
          }))}
        />

        <Select
          label="Language"
          value={languagePair}
          onChange={(value) => setLanguagePair(value as LanguagePair)}
          options={[
            { value: 'english-italian', label: '🇬🇧 English - Italian 🇮🇹' },
            { value: 'english-japanese', label: '🇬🇧 English - Japanese 🇯🇵' },
            { value: 'english-czech', label: '🇬🇧 English - Czech 🇨🇿' },
            { value: 'english-portuguese', label: '🇬🇧 English - Portuguese 🇵🇹' },
            { value: 'czech-portuguese', label: '🇨🇿 Czech - Portuguese 🇵🇹' }
          ]}
        />

        <ControlGroup label="Direction">
          <ToggleButton
            onClick={() =>
              setDirection(direction === 'forward' ? 'reverse' : 'forward')
            }
          >
            {`${langs.fromFlag} → ${langs.toFlag}`}
          </ToggleButton>
        </ControlGroup>
      </div>

      <Card className="mt-2">
        <WordDisplay
          label={langs.fromLabel}
          word={getWordText(currentWord, langs.from)}
          onSpeak={() =>
            speakText(getWordText(currentWord, langs.from), langs.from)
          }
        />

        {practiceMode === 'flashcard' ? (
          <>
            <WordDisplay
              label={langs.toLabel}
              word={getWordText(currentWord, langs.to)}
              onSpeak={() =>
                speakText(getWordText(currentWord, langs.to), langs.to)
              }
              color="primary"
            />

            <div className="flex justify-center">
              <Button onClick={handleSkip}>Next →</Button>
            </div>
          </>
        ) : practiceMode === 'typing' ? (
          <>
            <div className="mb-6">
              <Input
                value={userInput}
                onChange={setUserInput}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (feedback ? nextWord() : checkAnswer())
                }
                placeholder={`Type the ${langs.toLabel} translation`}
                disabled={feedback !== null}
              />
            </div>

            {feedback && (
              <Feedback
                type={feedback}
                correctAnswer={
                  feedback === 'incorrect'
                    ? getWordText(currentWord, langs.to)
                    : undefined
                }
                onSpeak={
                  feedback === 'incorrect'
                    ? () =>
                        speakText(getWordText(currentWord, langs.to), langs.to)
                    : undefined
                }
              />
            )}

            <div className="flex flex-wrap justify-center gap-4">
              {!feedback ? (
                <>
                  <Button onClick={checkAnswer}>Check Answer</Button>
                  <Button variant="skip" onClick={handleSkip}>
                    Next →
                  </Button>
                </>
              ) : (
                <Button onClick={nextWord}>Next word →</Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {multipleChoiceOptions.map((option, index) => {
                const correctAnswer = getWordText(currentWord, langs.to);
                const isCorrectOption = option === correctAnswer;
                const isSelected = option === selectedOption;

                return (
                  <ChoiceButton
                    key={index}
                    option={option}
                    isCorrect={isCorrectOption}
                    isSelected={isSelected}
                    showFeedback={feedback !== null}
                    onClick={() => handleMultipleChoiceSelection(option)}
                    onSpeak={() => speakText(option, langs.to)}
                    disabled={feedback !== null}
                  />
                );
              })}
            </div>

            {!feedback && (
              <div className="flex justify-center">
                <Button variant="skip" onClick={handleSkip}>
                  Next →
                </Button>
              </div>
            )}

            {feedback && (
              <div className="flex justify-center">
                <Button onClick={nextWord}>Next word →</Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
