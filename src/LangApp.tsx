import { useState, useEffect } from 'preact/hooks';
import { useLocalStorage } from './hooks/useLocalStorage';
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
  Input,
  Feedback,
  ChoiceButton,
  Header,
} from './components';

type Language = 'english' | 'italian' | 'japanese' | 'czech' | 'portuguese' | 'spanish';
type ContentType = 'vocabulary' | 'phrases';
type WordOrPhrase = VocabularyWord | Phrase;

export function LangApp() {
  const [currentWord, setCurrentWord] = useState<WordOrPhrase | null>(null);
  const [, setShowAnswer] = useState(false);
  const [fromLanguage, setFromLanguage] = useLocalStorage<Language>('fromLanguage', 'english');
  const [toLanguage, setToLanguage] = useLocalStorage<Language>('toLanguage', 'italian');
  const [contentType, setContentType] = useState<ContentType>('vocabulary');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [practiceMode, setPracticeMode] = useLocalStorage<'learn' | 'answer' | 'guess'>('practiceMode', 'guess');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getCurrentData = () => {
    return contentType === 'vocabulary' ? vocabulary : phrases;
  };

  const categories = ['all', ...Array.from(new Set(getCurrentData().map((w) => w.category)))];

  const getLanguageInfo = (language: Language) => {
    switch (language) {
      case 'english':
        return { label: 'English', flag: '🇬🇧' };
      case 'italian':
        return { label: 'Italian', flag: '🇮🇹' };
      case 'japanese':
        return { label: 'Japanese', flag: '🇯🇵' };
      case 'czech':
        return { label: 'Czech', flag: '🇨🇿' };
      case 'portuguese':
        return { label: 'Portuguese', flag: '🇵🇹' };
      case 'spanish':
        return { label: 'Spanish', flag: '🇪🇸' };
    }
  };

  const getLanguages = () => {
    const fromInfo = getLanguageInfo(fromLanguage);
    const toInfo = getLanguageInfo(toLanguage);

    return {
      from: fromLanguage,
      to: toLanguage,
      fromLabel: fromInfo.label,
      toLabel: toInfo.label,
      fromFlag: fromInfo.flag,
      toFlag: toInfo.flag,
    };
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

    if (practiceMode === 'guess' && newWord) {
      setMultipleChoiceOptions(generateMultipleChoiceOptions(newWord));
    }
  };

  const checkAnswer = () => {
    if (!currentWord) return;

    const langs = getLanguages();
    const expectedAnswer = getWordText(currentWord, langs.to);
    const isCorrect = userInput.toLowerCase().trim() === expectedAnswer.toLowerCase();

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
    text = text.replace(/\[[^\]]+\]/, '');

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Set language codes
      let langCode: string;
      switch (language) {
        case 'english':
          langCode = 'en-US';
          break;
        case 'italian':
          langCode = 'it-IT';
          break;
        case 'japanese':
          langCode = 'ja-JP';
          break;
        case 'czech':
          langCode = 'cs-CZ';
          break;
        case 'portuguese':
          langCode = 'pt-BR';
          break;
        case 'spanish':
          langCode = 'es-ES';
          break;
        default:
          langCode = 'en-US';
      }

      utterance.lang = langCode;

      // Safari fix: Try to find and set a voice that matches the language
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((voice) => voice.lang.startsWith(langCode.split('-')[0]));

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    nextWord();
  }, [selectedCategory, fromLanguage, toLanguage, practiceMode, contentType]);


  if (!currentWord) return null;

  const langs = getLanguages();

  return (
    <div className="max-md:bg-white p-4">
      <Header
        contentType={contentType}
        onContentTypeChange={setContentType}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <div className="mt-2 md:p-4 bg-white max-md:h-full md:rounded-xl md:shadow-2xl max-w-4xl mx-auto">
        <div className="flex flex-col gap-1">
          <SegmentedControl
            value={practiceMode}
            onChange={(value) => setPracticeMode(value as any)}
            options={[
              { value: 'learn', label: 'Learn' },
              { value: 'guess', label: 'Guess' },
              { value: 'answer', label: 'Answer' },
            ]}
          />

          <div className="flex gap-2">
            <Select
              value={fromLanguage}
              onChange={(value) => setFromLanguage(value as Language)}
              className="from-language-select flex-1"
              options={[
                { value: 'english', label: '🇬🇧 English' },
                { value: 'italian', label: '🇮🇹 Italian' },
                { value: 'japanese', label: '🇯🇵 Japanese' },
                { value: 'czech', label: '🇨🇿 Czech' },
                { value: 'portuguese', label: '🇵🇹 Portuguese' },
                { value: 'spanish', label: '🇪🇸 Spanish' },
              ]}
            />

            <Button
              variant="icon"
              onClick={() => {
                const temp = fromLanguage;
                setFromLanguage(toLanguage);
                setToLanguage(temp);
              }}
              title="Swap languages"
            >
              ⇄
            </Button>

            <Select
              value={toLanguage}
              onChange={(value) => setToLanguage(value as Language)}
              className="to-language-select flex-1"
              options={[
                { value: 'english', label: '🇬🇧 English' },
                { value: 'italian', label: '🇮🇹 Italian' },
                { value: 'japanese', label: '🇯🇵 Japanese' },
                { value: 'czech', label: '🇨🇿 Czech' },
                { value: 'portuguese', label: '🇵🇹 Portuguese' },
                { value: 'spanish', label: '🇪🇸 Spanish' },
              ]}
            />
          </div>
        </div>

        <Card className="mt-2">
          {(practiceMode === 'guess' || practiceMode === 'answer') && (
            <div className="text-center mb-4">
              <span className="text-sm text-gray-600">
                Score: {score.correct}/{score.total}
              </span>
            </div>
          )}

          <WordDisplay
            label={langs.fromLabel}
            word={getWordText(currentWord, langs.from)}
            onSpeak={() => speakText(getWordText(currentWord, langs.from), langs.from)}
          />

          {practiceMode === 'learn' ? (
            <>
              <WordDisplay
                label={langs.toLabel}
                word={getWordText(currentWord, langs.to)}
                onSpeak={() => speakText(getWordText(currentWord, langs.to), langs.to)}
                color="primary"
              />

              <div className="flex justify-center">
                <Button onClick={handleSkip}>Next →</Button>
              </div>
            </>
          ) : practiceMode === 'answer' ? (
            <>
              <div className="mb-6">
                <Input
                  value={userInput}
                  onChange={setUserInput}
                  onKeyDown={(e) => e.key === 'Enter' && (feedback ? nextWord() : checkAnswer())}
                  placeholder={`Type the ${langs.toLabel} translation`}
                  disabled={feedback !== null}
                />
              </div>

              {feedback && (
                <Feedback
                  type={feedback}
                  correctAnswer={feedback === 'incorrect' ? getWordText(currentWord, langs.to) : undefined}
                  onSpeak={
                    feedback === 'incorrect' ? () => speakText(getWordText(currentWord, langs.to), langs.to) : undefined
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
    </div>
  );
}
