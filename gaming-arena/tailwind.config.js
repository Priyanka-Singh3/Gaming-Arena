import { useState, useEffect } from "react";
import rock from "../assets/rock.png";
import paper from "../assets/paper.png";
import scissor from "../assets/scissor.png";

const choices = ["Rock", "Paper", "Scissors"];
const handImages = {
  Rock: rock,
  Paper: paper,
  Scissors: scissor,
};

function getResult(player, computer) {
  if (player === computer) return "Draw";
  if (
    (player === "Rock" && computer === "Scissors") ||
    (player === "Paper" && computer === "Rock") ||
    (player === "Scissors" && computer === "Paper")
  ) {
    return "player";
  }
  return "computer";
}

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [resultText, setResultText] = useState("");
  const [matchOver, setMatchOver] = useState(false);

  function handlePlay(choice) {
    if (matchOver) return;
    setPlayerChoice(choice);
    setCountdown(3);
  }

  function resetRound() {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResultText("");
    setCountdown(null);
  }

  function resetGame() {
    setPlayerScore(0);
    setComputerScore(0);
    setMatchOver(false);
    resetRound();
  }

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    const comp = choices[Math.floor(Math.random() * 3)];
    setComputerChoice(comp);
    const winner = getResult(playerChoice, comp);

    if (winner === "player") {
      setPlayerScore((s) => s + 1);
      setResultText("You Win!");
    } else if (winner === "computer") {
      setComputerScore((s) => s + 1);
      setResultText("You Lose!");
    } else {
      setResultText("Draw");
    }
  }, [countdown]);

  // Detect match winner
  useEffect(() => {
    if (playerScore === 5 || computerScore === 5) {
      setMatchOver(true);
      const winnerText = playerScore === 5 ? "🎉 You won the match!" : "💻 CPU won the match!";
      setTimeout(() => {
        alert(winnerText);
        resetGame();
      }, 2500);
    }
  }, [playerScore, computerScore]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200 py-10 px-4 font-sans">
      <h2 className="text-4xl font-extrabold text-pink-800 mb-6">Rock Paper Scissors</h2>

      {/* Scoreboard */}
      <div className="flex justify-between w-full max-w-md mb-4 px-8 text-xl font-bold text-pink-700">
        <div className="text-left">💻 CPU: {computerScore}</div>
        <div className="text-right">You: {playerScore} 🧍‍♂️</div>
      </div>

      {/* Game Area */}
      {!playerChoice ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handlePlay(choice)}
              className="flex flex-col items-center hover:scale-110 transition-transform duration-200"
            >
              <img
                src={handImages[choice]}
                alt={choice}
                className="w-28 h-28 sm:w-32 sm:h-32 mb-2 drop-shadow-lg"
              />
              <span className="text-lg font-semibold text-pink-700">{choice}</span>
            </button>
          ))}
        </div>
      ) : countdown > 0 ? (
        <div className="text-center text-pink-700 text-7xl font-black mb-4 animate-bounce">
          {countdown}
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center gap-10 mb-6">
            <div className="flex flex-col items-center">
              <span className="font-bold text-pink-600 mb-1">CPU</span>
              <img
                src={handImages[computerChoice]}
                alt={computerChoice}
                className="w-24 h-24 drop-shadow-md"
              />
            </div>
            <div className="text-3xl text-pink-700 font-bold">vs</div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-pink-600 mb-1">You</span>
              <img
                src={handImages[playerChoice]}
                alt={playerChoice}
                className="w-24 h-24 drop-shadow-md"
              />
            </div>
          </div>

          <p className="text-2xl font-bold text-pink-900 mb-4">{resultText}</p>

          {!matchOver && (
            <button
              onClick={resetRound}
              className="px-6 py-2 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition duration-200"
            >
              Next Round
            </button>
          )}
        </>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import rock from "../assets/rock.png";
import paper from "../assets/paper.png";
import scissor from "../assets/scissor.png";

const choices = ["Rock", "Paper", "Scissors"];
const handImages = {
  Rock: rock,
  Paper: paper,
  Scissors: scissor,
};

function getResult(player, computer) {
  if (player === computer) return "Draw";
  if (
    (player === "Rock" && computer === "Scissors") ||
    (player === "Paper" && computer === "Rock") ||
    (player === "Scissors" && computer === "Paper")
  ) {
    return "player";
  }
  return "computer";
}

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [resultText, setResultText] = useState("");
  const [matchOver, setMatchOver] = useState(false);

  function handlePlay(choice) {
    if (matchOver) return;
    setPlayerChoice(choice);
    setCountdown(3);
  }

  function resetRound() {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResultText("");
    setCountdown(null);
  }

  function resetGame() {
    setPlayerScore(0);
    setComputerScore(0);
    setMatchOver(false);
    resetRound();
  }

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    const comp = choices[Math.floor(Math.random() * 3)];
    setComputerChoice(comp);
    const winner = getResult(playerChoice, comp);

    if (winner === "player") {
      setPlayerScore((s) => s + 1);
      setResultText("You Win!");
    } else if (winner === "computer") {
      setComputerScore((s) => s + 1);
      setResultText("You Lose!");
    } else {
      setResultText("Draw");
    }
  }, [countdown]);

  // Detect match winner
  useEffect(() => {
    if (playerScore === 5 || computerScore === 5) {
      setMatchOver(true);
      const winnerText = playerScore === 5 ? "🎉 You won the match!" : "💻 CPU won the match!";
      setTimeout(() => {
        alert(winnerText);
        resetGame();
      }, 2500);
    }
  }, [playerScore, computerScore]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200 py-10 px-4 font-sans">
      <h2 className="text-4xl font-extrabold text-pink-800 mb-6">Rock Paper Scissors</h2>

      {/* Scoreboard */}
      <div className="flex justify-between w-full max-w-md mb-4 px-8 text-xl font-bold text-pink-700">
        <div className="text-left">💻 CPU: {computerScore}</div>
        <div className="text-right">You: {playerScore} 🧍‍♂️</div>
      </div>

      {/* Game Area */}
      {!playerChoice ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handlePlay(choice)}
              className="flex flex-col items-center hover:scale-110 transition-transform duration-200"
            >
              <img
                src={handImages[choice]}
                alt={choice}
                className="w-28 h-28 sm:w-32 sm:h-32 mb-2 drop-shadow-lg"
              />
              <span className="text-lg font-semibold text-pink-700">{choice}</span>
            </button>
          ))}
        </div>
      ) : countdown > 0 ? (
        <div className="text-center text-pink-700 text-7xl font-black mb-4 animate-bounce">
          {countdown}
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center gap-10 mb-6">
            <div className="flex flex-col items-center">
              <span className="font-bold text-pink-600 mb-1">CPU</span>
              <img
                src={handImages[computerChoice]}
                alt={computerChoice}
                className="w-24 h-24 drop-shadow-md"
              />
            </div>
            <div className="text-3xl text-pink-700 font-bold">vs</div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-pink-600 mb-1">You</span>
              <img
                src={handImages[playerChoice]}
                alt={playerChoice}
                className="w-24 h-24 drop-shadow-md"
              />
            </div>
          </div>

          <p className="text-2xl font-bold text-pink-900 mb-4">{resultText}</p>

          {!matchOver && (
            <button
              onClick={resetRound}
              className="px-6 py-2 bg-pink-600 text-white rounded-full font-bold hover:bg-pink-700 transition duration-200"
            >
              Next Round
            </button>
          )}
        </>
      )}
    </div>
  );
}
