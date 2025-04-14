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
        const response = await fetch("http://localhost:3001/data");
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
      <h1>Quiz</h1>
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
            questionsCompleted={questionsCompleted}
            autoAdvance={true}
          />
        )
      )}
    </div>
  );
};

export default QuizScreen;
