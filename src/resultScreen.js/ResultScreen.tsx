import React from "react";
import { QuestionData } from "../types/question";

interface ResultScreenProps {
  questions: QuestionData[];
  userAnswers: string[][];
  onGoToEnglishCard: () => void;
  onRestartQuiz: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  questions,
  userAnswers,
  onGoToEnglishCard,
}) => {
  let score = 0;
  const results = questions.map((question, index) => {
    const correctAnswers = question.correctAnswer || [];
    const userAnswer = userAnswers[index] || [];
    const isCorrect =
      userAnswer.length === correctAnswers.length &&
      userAnswer.every(
        (answer, i) => answer.trim() === correctAnswers[i].trim()
      );
    if (isCorrect) {
      score++;
    }
    return { question, userAnswer, isCorrect };
  });

  const overallScorePercentage = (score / questions.length) * 100;
  let feedbackText = "";

  if (overallScorePercentage >= 90) {
    feedbackText = "Excellent work! You have a strong understanding.";
  } else if (overallScorePercentage >= 70) {
    feedbackText = "Good job! You're showing a solid grasp of the concepts.";
  } else if (overallScorePercentage >= 50) {
    feedbackText = "Keep practicing! You're making progress.";
  } else {
    feedbackText = "Let's review the material. Consistent practice will help!";
  }

  const displayUserAnswerInQuestion = (
    questionText: string,
    userAnswer: string[]
  ) => {
    const parts = questionText.split("_____________");
    return parts.reduce((acc, part, index) => {
      acc.push(part);
      if (index < userAnswer.length) {
        acc.push(
          <span className="font-semibold text-blue-500">
            {userAnswer[index] || "__________"}
          </span>
        );
      }
      return acc;
    }, [] as React.ReactNode[]);
  };

  return (
    <div
      className="
        mx-auto
        mt-10
        p-6
        bg-white
        rounded-xl
        shadow-md
        w-full
        max-w-lg
        flex
        flex-col
        gap-8
        sm:mt-16
        sm:max-w-2xl
        sm:p-8
        md:max-w-3xl
        lg:max-w-4xl
        lg:gap-12
        lg:p-10
      "
    >
      <div className="flex flex-col items-center mb-6">
        <div
          className={`
            w-20
            h-20
            rounded-full
            ${
              overallScorePercentage >= 70
                ? "bg-green-100 text-green-500"
                : "bg-yellow-100 text-yellow-500"
            }
            flex
            items-center
            justify-center
            text-3xl
            font-bold
          `}
        >
          {Math.round(overallScorePercentage)}%
        </div>
        <div className="mt-1 text-sm text-gray-600">Overall Score</div>
      </div>

      <div className="text-center text-sm text-gray-700 leading-relaxed mb-8">
        {feedbackText}
      </div>

      <button
        onClick={onGoToEnglishCard}
        className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 mb-8 text-sm"
      >
        Go to Dashboard
      </button>

      <div className="mb-12 border-t pt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Review Your Answers
        </h2>
        {results.map(({ question, userAnswer, isCorrect }, index) => (
          <div
            key={index}
            className="w-full bg-white rounded-md mb-6 border border-gray-200 text-sm"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-2 text-xs text-gray-600">
                <div>Prompt</div>
                <div>
                  {index + 1}/{questions.length}
                </div>
              </div>

              <div className="mb-3 text-gray-800 leading-relaxed">
                {displayUserAnswerInQuestion(question.question, userAnswer)}
              </div>
            </div>
            <div
              className={`p-4 rounded-bg-md ${
                isCorrect ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div
                  className={`mb-1 sm:mb-0 text-xs font-bold text-${
                    isCorrect ? "green" : "red"
                  }-500`}
                >
                  Your response:{" "}
                  <span className="ml-1">
                    {isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
                {!isCorrect && question.correctAnswer && (
                  <div className="text-xs text-gray-600">
                    Correct answer(s): {question.correctAnswer.join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultScreen;
