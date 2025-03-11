import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchQuizData } from "../services/game.api";
import CircularTimer from "../components/timer";
import Message from "../components/message";
import "./Styles/game.css";
import { fetchExistingScore, saveScore, updateUserScore } from "../services/score"; // Adjust the path

const Game = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const level = parseInt(queryParams.get("level")) || 1;

  const getTimeLimit = (level) => {
    switch (level) {
      case 1:
        return 90;
      case 2:
        return 60;
      case 3:
        return 30;
      default:
        return 90;
    }
  };

  const getPenalty = (level) => {
    switch (level) {
      case 1:
        return -3;
      case 2:
        return -5;
      case 3:
        return -7;
      default:
        return -3;
    }
  };

  const timeLimit = getTimeLimit(level);
  const penalty = getPenalty(level);

  const [quizImage, setQuizImage] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [existingScore, setExistingScore] = useState(null);

  const generateRandomAnswers = (correctAnswer) => {
    let randomAnswers = [];
    while (randomAnswers.length < 3) {
      let randomNumber = Math.floor(Math.random() * 10);
      if (randomNumber !== correctAnswer && !randomAnswers.includes(randomNumber)) {
        randomAnswers.push(randomNumber);
      }
    }
    return randomAnswers;
  };

  const loadQuiz = async () => {
    if (questionCount >= 10) return;

    const quizData = await fetchQuizData();
    if (quizData) {
      const correct = Number(quizData.solution);
      const randomAnswers = generateRandomAnswers(correct);
      setQuizImage(quizData.question);
      setCorrectAnswer(correct);
      setAnswers([correct, ...randomAnswers].sort(() => Math.random() - 0.5));
      setIsLoaded(true);
    } else {
      setResultMessage("Failed to load quiz data.");
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      // const fetchedScore = await fetchExistingScore();
      // setExistingScore(fetchedScore);
      loadQuiz();
    };
    loadInitialData();
  }, []);

  const handleAnswerClick = (answer) => {
    setUserAnswer(answer);
    if (answer === correctAnswer) {
      setScore(score + 10);
    } else {
      setScore(score + penalty);
    }
    setQuestionCount(questionCount + 1);
    setTimeout(() => {
      loadQuiz();
    }, 1000);
  };

  const handleTimeEnd = async () => {
    setGameOver(true);
    const result = await updateUserScore(score, level); // No need to pass userId
    setResultMessage(result.message);
  };

  return (
    <div className="game-container">
      {gameOver ? (
        <Message message={resultMessage} score={score} />
      ) : (
        <>
          {quizImage ? (
            <div className="quiz-container">
              <div className="timer-container">
                {isLoaded && <CircularTimer timeLimit={timeLimit} onTimeEnd={handleTimeEnd} />}
              </div>
              <div className="quiz-content">
                <div className="quiz-image-container">
                  <img src={quizImage} alt="Quiz" />
                </div>
                <div className="answer-buttons">
                  {answers.map((answer, index) => (
                    <button
                      key={index}
                      className="answer-button"
                      onClick={() => handleAnswerClick(answer)}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
              <p className="score-container">Score: {score}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </div>
  );
};

export default Game;