import React, { useState, useEffect } from "react";
import { QuestionData } from "../types/question";
import TestScreen from "./TestScreen";
import ResultScreen from "../resultScreen.js/ResultScreen";
import EnglishCard from "../components/EnglishCard";

interface ApiResponseFromServer {
  testId: string;
  questions: QuestionData[];
}

const QuizScreen: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[][]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [navigateToEnglishCard, setNavigateToEnglishCard] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://backend-camonk.onrender.com/data"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiResponseFromServer = await response.json();
        setQuestions(data?.questions || []);
        setUserAnswers(Array(data?.questions?.length || 0).fill([]));
        setLoading(false);
      } catch (e: any) {
        setError(e.message || "Failed to fetch questions");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerSubmit = (answers: string[]) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answers;
    setUserAnswers(newAnswers);
    setQuestionsCompleted((prevCompleted) =>
      Math.max(prevCompleted, currentQuestionIndex + 1)
    );
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleShowResults = (finalAnswers: string[]) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = finalAnswers;
    setUserAnswers(newAnswers);
    setQuizFinished(true);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuestionsCompleted(0);
    setUserAnswers(Array(questions.length).fill([]));
    setQuizFinished(false);
    setNavigateToEnglishCard(false);
  };

  const handleGoToEnglishCard = () => {
    setNavigateToEnglishCard(true);
  };

  const handleEnglishCardStart = () => {
    setNavigateToEnglishCard(false);
    handleRestartQuiz();
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error fetching questions: {error}</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available.</div>;
  }

  return (
    <div>
      {navigateToEnglishCard ? (
        <EnglishCard onStartClick={handleEnglishCardStart} />
      ) : quizFinished ? (
        <ResultScreen
          questions={questions}
          userAnswers={userAnswers}
          onGoToEnglishCard={handleGoToEnglishCard}
          onRestartQuiz={handleRestartQuiz}
        />
      ) : (
        currentQuestionIndex < questions.length && (
          <TestScreen
            currentQuestionIndex={currentQuestionIndex}
            questions={[questions[currentQuestionIndex]]}
            onNextQuestion={handleAnswerSubmit}
            onShowResults={handleShowResults} // Pass the new prop
            questionsCompleted={questionsCompleted}
            autoAdvance={true}
            totalQuestions={questions.length} // Pass the total number of questions
            onQuit={() => setNavigateToEnglishCard(true)} // Handle quit action
          />
        )
      )}
    </div>
  );
};

export default QuizScreen;
