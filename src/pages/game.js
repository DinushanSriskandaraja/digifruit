import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchQuizData } from "../services/game.api";
import CircularTimer from "../components/timer";  // Import CircularTimer
import './Styles/game.css';

const Game = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const level = parseInt(queryParams.get("level")) || 1;

  const getTimeLimit = (level) => {
    switch (level) {
      case 1:
        return 30;
      case 2:
        return 60;
      case 3:
        return 90;
      default:
        return 30;
    }
  };

  const timeLimit = getTimeLimit(level);

  const [quizImage, setQuizImage] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      const quizData = await fetchQuizData();
      if (quizData) {
        setQuizImage(quizData.question);
        setCorrectAnswer(Number(quizData.solution));
        setIsLoaded(true);
      } else {
        setResultMessage("Failed to load quiz data.");
      }
    };

    loadQuiz();
  }, []);

  const checkAnswer = () => {
    if (Number(userAnswer.trim()) === correctAnswer) {
      setResultMessage("✅ Correct!");
    } else {
      setResultMessage("❌ Incorrect. Try again!");
    }
  };

  return (
    <div className="game-container">
      <h2>Quiz Game - Level {level}</h2>
      {quizImage ? (
        <>
          {isLoaded && <CircularTimer timeLimit={timeLimit} />} {/* Use CircularTimer */}
          <img src={quizImage} alt="Quiz" className="quiz-image" />
          <input
            type="number"
            placeholder="Enter your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <button onClick={checkAnswer}>Submit</button>
          <p>{resultMessage}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Game;
