import apiService from '../services/game.api';

class GameLogic {
  constructor() {
    this.score = 0;
  }

  generateRandomNumbers(correctAnswer) {
    let randomAnswers = new Set();
    while (randomAnswers.size < 3) {
      let randomNumber = Math.floor(Math.random() * 10); // Adjust range as needed
      if (randomNumber !== correctAnswer) {
        randomAnswers.add(randomNumber);
      }
    }
    return Array.from(randomAnswers);
  }

  async fetchQuizData(fetchQuizDataFn) {
    const quizData = await fetchQuizDataFn();
    if (quizData) {
      const correctAnswer = Number(quizData.solution);
      const randomAnswers = this.generateRandomNumbers(correctAnswer);
      return {
        imageUrl: quizData.question,
        options: [correctAnswer, ...randomAnswers].sort(() => Math.random() - 0.5),
        solution: correctAnswer
      };
    }
    throw new Error("Failed to load quiz data.");
  }

  checkAnswer(userAnswer, correctAnswer) {
    return userAnswer === correctAnswer;
  }

  updateScore() {
    this.score += 10;
    apiService.updateScore(this.score);
  }
}

export default GameLogic;
