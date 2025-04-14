import React, { useState, useEffect, useMemo } from "react";
import { QuestionData } from "../types/question";
import Button from "../components/Button";

interface TestScreenProps {
  questions: QuestionData[];
  onNextQuestion: (answers: string[]) => void;
  onShowResults: (finalAnswers: string[]) => void;
  autoAdvance: boolean;
  currentQuestionIndex: number;
  questionsCompleted: number;
  totalQuestions: number;
  onQuit: () => void;
}

const TestScreen: React.FC<TestScreenProps> = ({
  questions,
  onNextQuestion,
  onShowResults,
  autoAdvance,
  currentQuestionIndex,
  questionsCompleted,
  totalQuestions,
  onQuit,
}) => {
  const currentQuestion = questions[0];
  const blanksCount = useMemo(
    () => currentQuestion?.question?.split("_____________").length - 1 || 0,
    [currentQuestion?.question]
  );
  const [timeLeft, setTimeLeft] = useState(30);
  const [intervalId, setIntervalId] = useState<number | undefined>(undefined);
  const [selectedWords, setSelectedWords] = useState<string[]>(
    Array(blanksCount).fill("")
  );
  const [availableOptions, setAvailableOptions] = useState<string[]>(
    currentQuestion?.options || []
  );
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuitModalVisible, setIsQuitModalVisible] = useState(false);

  const handleQuitClick = () => {
    setIsQuitModalVisible(true);
  };

  const handleConfirmQuit = () => {
    setIsQuitModalVisible(false);
    onQuit();
  };

  const handleCancelQuit = () => {
    setIsQuitModalVisible(false);
  };

  useEffect(() => {
    let timerId: number | undefined;
    if (autoAdvance && currentQuestion && !isAnswered) {
      setTimeLeft(30);
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      setIntervalId(timerId);
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [autoAdvance, currentQuestion?.questionId, isAnswered]);

  useEffect(() => {
    if (autoAdvance && timeLeft === 0 && !isAnswered) {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (currentQuestionIndex === totalQuestions - 1) {
        onShowResults(selectedWords);
      } else {
        handleNextQuestion();
      }
      setTimeLeft(30);
    }
  }, [
    autoAdvance,
    timeLeft,
    onNextQuestion,
    onShowResults,
    intervalId,
    selectedWords,
    isAnswered,
    currentQuestionIndex,
    totalQuestions,
  ]);

  useEffect(() => {
    setSelectedWords(Array(blanksCount).fill(""));
    setAvailableOptions(currentQuestion?.options || []);
    setCurrentBlankIndex(0);
    setIsAnswered(false);
  }, [currentQuestion?.questionId, blanksCount, currentQuestion?.options]);

  const handleWordSelect = (word: string) => {
    const newSelectedWords = [...selectedWords];
    const currentWordInBlank = newSelectedWords[currentBlankIndex];

    if (currentWordInBlank !== word) {
      if (currentWordInBlank) {
        setAvailableOptions((prevOptions) => [
          ...prevOptions,
          currentWordInBlank,
        ]);
      }
      newSelectedWords[currentBlankIndex] = word;
      setSelectedWords(newSelectedWords);
      setAvailableOptions((prevOptions) =>
        prevOptions.filter((option) => option !== word)
      );
      if (currentBlankIndex < blanksCount - 1 && word) {
        setCurrentBlankIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const handleBlankClick = (index: number) => {
    const wordInBlank = selectedWords[index];
    if (wordInBlank) {
      const newSelectedWords = [...selectedWords];
      newSelectedWords[index] = "";
      setSelectedWords(newSelectedWords);
      setAvailableOptions((prevOptions) => [...prevOptions, wordInBlank]);
    }
    setCurrentBlankIndex(index);
  };

  const renderQuestionWithBlanks = () => {
    const parts = currentQuestion.question.split("_____________");
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && (
          <span
            onClick={() => handleBlankClick(index)}
            className={`border-b border-dashed border-gray-400 inline-block min-w-[80px] text-center cursor-pointer ${
              currentBlankIndex === index ? "bg-yellow-100" : ""
            } ${selectedWords[index] ? "font-semibold" : ""}`}
          >
            {selectedWords[index] ||
              "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          </span>
        )}
      </React.Fragment>
    ));
  };

  const allBlanksFilled = useMemo(() => {
    return selectedWords.every((word) => word !== "");
  }, [selectedWords]);

  const handleNextQuestion = () => {
    if (allBlanksFilled) {
      setIsAnswered(true);
      onNextQuestion(selectedWords);
    } else {
      console.log("Please fill in all the blanks.");
    }
  };

  return (
    <div
      className="
        mx-auto
        mt-8
        p-6
        bg-white
        rounded-xl
        shadow-md
        w-full
        max-w-lg
        flex
        flex-col
        gap-8
        sm:max-w-2xl
        sm:p-8
        md:max-w-3xl
        lg:max-w-4xl
        lg:gap-12
        lg:p-10
      "
    >
      <div className="flex justify-between items-center">
        <div className="text-lg text-gray-700">{timeLeft}</div>
        <Button
          onClick={handleQuitClick}
          className="border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Quit
        </Button>
      </div>

      {isQuitModalVisible && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-amber-100 p-6 rounded-md shadow-md w-96">
            {" "}
            {/* Increased width */}
            <p className="text-lg mb-4">Are you sure you want to quit?</p>
            <div className="flex justify-end gap-4">
              {" "}
              {/* Increased gap */}
              <Button
                onClick={handleCancelQuit}
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-base py-2 px-4"
              >
                {" "}
                {/* Increased text size and padding */}
                Cancel
              </Button>
              <Button
                onClick={handleConfirmQuit}
                className="bg-red-500 hover:bg-red-600 text-white text-base py-2 px-4"
              >
                {" "}
                {/* Increased text size and padding */}
                Quit
              </Button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex gap-2 sm:gap-3 mb-4 justify-center">
          {[...Array(totalQuestions)].map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-md ${
                index < questionsCompleted
                  ? "bg-green-500"
                  : index === currentQuestionIndex
                  ? "bg-green-300"
                  : "bg-gray-300"
              } w-8 sm:w-10`}
            />
          ))}
        </div>
        <div className="text-center text-gray-600 sm:text-lg mb-6">
          Select the missing words in the correct order
        </div>
      </div>

      <div className="text-lg leading-relaxed sm:text-xl">
        {renderQuestionWithBlanks()}
      </div>

      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        {availableOptions.map((option) => (
          <Button
            key={option}
            onClick={() => handleWordSelect(option)}
            className={`bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 ${
              selectedWords[currentBlankIndex] === option ? "bg-blue-200" : ""
            }`}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="mt-auto flex justify-center">
        <Button
          onClick={handleNextQuestion}
          disabled={!allBlanksFilled || isAnswered}
          className={`${
            allBlanksFilled && !isAnswered
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-400 cursor-not-allowed text-white"
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TestScreen;
