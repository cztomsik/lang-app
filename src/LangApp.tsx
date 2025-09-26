import { useEffect } from 'preact/hooks';
import { useAppState } from './hooks/useAppState';
import { useSpacedRepetition } from './hooks/useSpacedRepetition';
import type { VocabularyWord } from './vocabulary';
import type { Phrase } from './phrases';

type Language = 'english' | 'italian' | 'japanese' | 'czech' | 'portuguese' | 'spanish' | 'german';

import { Button, Card, WordDisplay, Input, Feedback, ChoiceButton, Header, SettingsPanel, ProgressPanel } from './components';

type WordOrPhrase = VocabularyWord | Phrase;

export function LangApp() {
  const appState = useAppState();

  const {
    // Extract what we need from appState
    fromLanguage,
    toLanguage,
    swapLanguages,
    contentType,
    setContentType,
    selectedCategory,
    handleCategoryChange,
    categories,
    practiceMode,
    setPracticeMode,
    showProgress,
    setShowProgress,
    showSettings,
    setShowSettings,
    currentWord,
    setCurrentWord,
    score,
    setScore,
    userInput,
    setUserInput,
    feedback,
    setFeedback,
    usedWords,
    setUsedWords,
    multipleChoiceOptions,
    setMultipleChoiceOptions,
    selectedOption,
    setSelectedOption,
    getFilteredWords,
  } = appState;

  // Spaced repetition hook - always enabled
  const { stats, recordProgress, getWordProgress, getCategoryStats, calculateWordStrength } = useSpacedRepetition(
    contentType,
    fromLanguage,
    toLanguage
  );

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
      case 'german':
        return { label: 'German', flag: '🇩🇪' };
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

  const getRandomWord = () => {
    const words = getFilteredWords();
    if (usedWords.size >= words.length) {
      setUsedWords(new Set());
    }

    // Create array of available words (not used yet)
    const availableWords = words.filter((_, index) => !usedWords.has(index));

    if (availableWords.length === 0) {
      // Fallback to regular selection if all used
      const randomIndex = Math.floor(Math.random() * words.length);
      setUsedWords((prev) => new Set([...prev, randomIndex]));
      return words[randomIndex];
    }

    // Calculate weights based on difficulty (lower easeFactor = higher weight)
    const weights = availableWords.map((word) => {
      const wordId = `${getWordText(word, fromLanguage)}_${word.category}`;
      const progress = getWordProgress(wordId);

      if (!progress) {
        return 1; // New words get normal weight
      }

      // Invert easeFactor so harder words (lower easeFactor) get higher weight
      // Map easeFactor 1.3-2.5 to weight 2.5-1.3 (inverted)
      const invertedWeight = 3.8 - progress.easeFactor;
      return Math.max(0.5, invertedWeight); // Minimum weight of 0.5
    });

    // Weighted random selection
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const randomValue = Math.random() * totalWeight;

    let currentWeight = 0;
    let selectedIndex = 0;

    for (let i = 0; i < weights.length; i++) {
      currentWeight += weights[i];
      if (randomValue <= currentWeight) {
        selectedIndex = i;
        break;
      }
    }

    const selectedWord = availableWords[selectedIndex];

    // Mark as used
    const originalIndex = words.indexOf(selectedWord);
    setUsedWords((prev) => new Set([...prev, originalIndex]));

    return selectedWord;
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
    setUserInput('');
    setFeedback(null);
    setSelectedOption(null);

    if (practiceMode === 'guess' && newWord) {
      setMultipleChoiceOptions(generateMultipleChoiceOptions(newWord as VocabularyWord));
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

    // Track progress for practice
    const wordId = `${getWordText(currentWord, fromLanguage)}_${currentWord.category}`;
    const quality = isCorrect ? 4 : 1;
    recordProgress(wordId, quality, currentWord.category);
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

    // Track progress for practice
    const wordId = `${getWordText(currentWord!, fromLanguage)}_${currentWord!.category}`;
    const quality = isCorrect ? 4 : 1;
    recordProgress(wordId, quality, currentWord!.category);
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
        case 'german':
          langCode = 'de-DE';
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
    <div class="max-md:bg-white p-4">
      <Header
        showProgress={showProgress}
        onToggleProgress={() => setShowProgress(!showProgress)}
        showSettings={showSettings}
        onToggleSettings={() => setShowSettings(!showSettings)}
        masteryPercentage={stats.masteryPercentage}
        dueCount={0}
      />

      {showProgress && (
        <ProgressPanel
          stats={stats}
          isReviewMode={false}
          onToggleReviewMode={() => {}}
          selectedCategory={selectedCategory}
          getCategoryStats={getCategoryStats}
        />
      )}

      {showSettings && (
        <SettingsPanel
          practiceMode={practiceMode}
          onPracticeModeChange={(value) => setPracticeMode(value)}
          fromLanguage={fromLanguage}
          toLanguage={toLanguage}
          onFromLanguageChange={appState.setFromLanguage}
          onToLanguageChange={appState.setToLanguage}
          onSwapLanguages={swapLanguages}
          contentType={contentType}
          onContentTypeChange={(value) => setContentType(value)}
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            handleCategoryChange(category);
          }}
          categories={categories}
        />
      )}

      <div class="mt-2 md:p-4 bg-white max-md:h-full md:rounded-xl md:shadow-2xl max-w-4xl mx-auto">
        <Card class="mt-2">
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

              <div class="flex justify-center">
                <Button
                  onClick={() => {
                    // In learn mode, mark as seen (quality 3 = just learned)
                    const wordId = `${getWordText(currentWord, fromLanguage)}_${currentWord.category}`;
                    recordProgress(wordId, 3, currentWord.category);
                    handleSkip();
                  }}
                >
                  Next →
                </Button>
              </div>
            </>
          ) : practiceMode === 'answer' ? (
            <>
              <div class="mb-6">
                <Input
                  value={userInput}
                  onChange={(value) => setUserInput(value)}
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

              <div class="flex flex-wrap justify-center gap-4">
                {!feedback ? (
                  <>
                    <Button onClick={() => checkAnswer()}>Check Answer</Button>
                    <Button variant="skip" onClick={() => handleSkip()}>
                      Next →
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => nextWord()}>Next word →</Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-8">
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
                <div class="flex justify-center">
                  <Button variant="skip" onClick={() => handleSkip()}>
                    Next →
                  </Button>
                </div>
              )}

              {feedback && (
                <div class="flex justify-center">
                  <Button onClick={() => nextWord()}>Next word →</Button>
                </div>
              )}

              {(practiceMode === 'guess' || practiceMode === 'answer') && (
                <div class="text-center mt-4 space-y-2">
                  <span class="text-sm text-gray-600">
                    Score: {score.correct}/{score.total}
                  </span>
                  {currentWord &&
                    (() => {
                      const wordId = `${getWordText(currentWord, fromLanguage)}_${currentWord.category}`;
                      const progress = getWordProgress(wordId);
                      if (!progress || progress.repetitions === 0) return null;

                      const strength = calculateWordStrength(progress.easeFactor);
                      const getStrengthColor = (strength: number) => {
                        if (strength < 30) return 'text-red-600 bg-red-50';
                        if (strength < 70) return 'text-yellow-600 bg-yellow-50';
                        return 'text-green-600 bg-green-50';
                      };

                      return (
                        <div class="flex items-center justify-center gap-3 text-xs">
                          <div class="flex items-center gap-1">
                            <span class="text-gray-500">Repetitions:</span>
                            <span class="font-medium text-blue-600">{progress.repetitions}</span>
                          </div>
                          <div class="flex items-center gap-1">
                            <span class="text-gray-500">Strength:</span>
                            <div class={`px-2 py-1 rounded-full font-medium ${getStrengthColor(strength)}`}>
                              {strength}%
                            </div>
                          </div>
                          <div class="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              class={`h-2 rounded-full transition-all duration-300 ${
                                strength < 30
                                  ? 'bg-gradient-to-r from-red-400 to-red-500'
                                  : strength < 70
                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                    : 'bg-gradient-to-r from-green-400 to-green-500'
                              }`}
                              style={{ width: `${strength}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
