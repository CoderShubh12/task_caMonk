import "./App.css";
import EnglishCard from "./components/EnglishCard";
import Navbar from "./components/Navbar";
import QuizScreen from "./screens/QuizScreen";
import { useState } from "react";

function App() {
  const [startQuiz, setStartQuiz] = useState(false);

  const handleStartQuiz = () => {
    setStartQuiz(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className=" flex justify-center items-center p-4 sm:p-8 mt-3.5">
        {!startQuiz ? (
          <EnglishCard onStartClick={handleStartQuiz} />
        ) : (
          <QuizScreen />
        )}
      </div>
    </div>
  );
}

export default App;
