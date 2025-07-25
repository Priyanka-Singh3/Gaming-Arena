import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const BOARD_SIZE = 18;
const INIT_SPEED = 9;

const getRandomPos = () =>
  ({
    x: Math.floor(1 + Math.random() * (BOARD_SIZE - 2)),
    y: Math.floor(1 + Math.random() * (BOARD_SIZE - 2)),
  });

const getInitialSnake = () => [getRandomPos()];

export default function SnakeGame() {
  const [snake, setSnake] = useState(getInitialSnake());
  const [food, setFood] = useState(getRandomPos());
  const [bonus, setBonus] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("hscore") || 0)
  );
  const [inputDir, setInputDir] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(INIT_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [snakeColor, setSnakeColor] = useState("#f59e42");
  // Snake head customization
  const [snakeHeadColor, setSnakeHeadColor] = useState("#ffffff");
  const [wasNewHighScore, setWasNewHighScore] = useState(false);
  const [lastDir, setLastDir] = useState({ x: 0, y: 0 });
  const [dirChanged, setDirChanged] = useState(false);

  const moveSound = useRef(null);
  const foodSound = useRef(null);
  const gameOverSound = useRef(null);

  useEffect(() => {
    const handleSpace = (e) => {
      if (e.code === "Space" && !e.repeat) {
        setPaused((p) => !p);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleSpace);
    return () => window.removeEventListener("keydown", handleSpace);
  }, []);
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT") return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (dirChanged) return; // Only allow one direction change per tick
      let dir = { ...inputDir };
      switch (e.key) {
        case "ArrowUp":
          dir = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          dir = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          dir = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          dir = { x: 1, y: 0 };
          break;
        default:
          return;
      }
      // Prevent reversing direction
      if (dir.x === -lastDir.x && dir.y === -lastDir.y) return;
      setInputDir(dir);
      setDirChanged(true);
      if (moveSound.current) {
        moveSound.current.currentTime = 0;
        moveSound.current.play();
      }
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [inputDir, lastDir, dirChanged]);

  // Main game loop
  useEffect(() => {
    if (gameOver || paused) return;
    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        // Move body
        for (let i = newSnake.length - 1; i > 0; i--) {
          newSnake[i] = { ...newSnake[i - 1] };
        }
        // Move head
        newSnake[0] = {
          x: newSnake[0].x + inputDir.x,
          y: newSnake[0].y + inputDir.y,
        };
        setLastDir(inputDir); // Update last direction after move
        setDirChanged(false); // Allow direction change for next tick

        // Check collision
        if (
          newSnake[0].x < 1 ||
          newSnake[0].x > BOARD_SIZE ||
          newSnake[0].y < 1 ||
          newSnake[0].y > BOARD_SIZE ||
          newSnake.slice(1).some((s) => s.x === newSnake[0].x && s.y === newSnake[0].y)
        ) {
          setGameOver(true);
          if (gameOverSound.current) {
            gameOverSound.current.currentTime = 0;
            gameOverSound.current.play();
          }
          return getInitialSnake();
        }

        // Check food
        if (newSnake[0].x === food.x && newSnake[0].y === food.y) {
          setScore((s) => s + 10);
          setFood(getRandomPos());
          newSnake.unshift({
            x: newSnake[0].x + inputDir.x,
            y: newSnake[0].y + inputDir.y,
          });
          if (foodSound.current) {
            foodSound.current.currentTime = 0;
            foodSound.current.play();
          }
        }

        // Check bonus
        if (bonus && newSnake[0].x === bonus.x && newSnake[0].y === bonus.y) {
          setScore((s) => s + 50);
          setBonus(null);
          setShowBonus(true);
          setTimeout(() => setShowBonus(false), 1200);
        }

        return newSnake;
      });
      // eslint-disable-next-line
    }, 1000 / speed);
    return () => clearInterval(interval);
  }, [inputDir, food, bonus, speed, gameOver, paused]);

  // Bonus item spawner
  useEffect(() => {
    if (gameOver || paused) return;
    let bonusTimeout;
    const interval = setInterval(() => {
      if (!bonus && !paused && !gameOver && Math.random() < 0.3) {
        setBonus(getRandomPos());
        bonusTimeout = setTimeout(() => {
          if (!paused && !gameOver) setBonus(null);
        }, 5000);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
      if (bonusTimeout) clearTimeout(bonusTimeout);
    };
  }, [bonus, gameOver, paused]);

  // Update high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("hscore", score);
      setWasNewHighScore(true);
    }
    // eslint-disable-next-line
  }, [score]);

  // Reset game
  const handleRestart = () => {
    setSnake(getInitialSnake());
    setFood(getRandomPos());
    setBonus(null);
    setScore(0);
    setInputDir({ x: 0, y: 0 });
    setGameOver(false);
    setPaused(false);
    setWasNewHighScore(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-snake-custom bg-cover bg-no-repeat bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-200">
      <div className="w-full flex flex-col justify-center items-center pt-4 pb-8">
        <div
          className="board bg-cyan-700 border-4 border-cyan-900 border-solid shadow-xl rounded-2xl grid"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
            width: '90vw',
            height: '90vw',
            maxWidth: '600px',
            maxHeight: '558px',
            minWidth: '260px',
            minHeight: '260px',
          }}
        >
          {/* Snake */}
          {snake.map((seg, idx) => (
            idx === 0 ? (
              <div
                key={idx}
                style={{
                  gridRowStart: seg.y,
                  gridColumnStart: seg.x,
                  background: snakeHeadColor,
                  border: "2px solid #0e2a36",
                  borderRadius: "50%",
                  boxShadow: "0 0 16px 4px #38bdf8, 0 2px 8px 0 rgba(56,189,248,0.3)",
                }}
                className="head"
              />
            ) : (
              <div
                key={idx}
                style={{
                  gridRowStart: seg.y,
                  gridColumnStart: seg.x,
                  background: snakeColor,
                  border: "2px solid #0e2a36",
                  borderRadius: "12px",
                  boxShadow: "0 1px 4px 0 rgba(56,189,248,0.15)",
                }}
                className="snake"
              />
            )
          ))}
          {/* Food */}
          <div
            style={{ gridRowStart: food.y, gridColumnStart: food.x }}
            className="food"
          />
          {/* Bonus */}
          {bonus && (
            <div
              style={{ gridRowStart: bonus.y, gridColumnStart: bonus.x }}
              className="bonus"
            />
          )}
        </div>
        {/* Controls */}
        <div className="relative w-full flex flex-col items-center mt-4 px-2 sm:px-0">
          <div className="bg-white/60 rounded-lg shadow p-4 max-w-xs w-full flex flex-col gap-4 items-center">
            <div className="bg-cyan-100/80 px-3 py-1 rounded-md shadow-inner mb-1 w-full flex justify-end transition-all duration-300">
              <span className="text-cyan-900 font-bold text-base text-right tracking-wide">
                High Score : {highScore}
              </span>
            </div>
            <div className="text-cyan-900 font-semibold text-xl text-right w-full">
              Score : {score}
            </div>
            {/* Speed Control */}
            <div className="flex flex-col items-end mt-1 w-full">
              <label htmlFor="speedControl" className="text-cyan-900 text-sm font-medium mb-1">Speed:</label>
              <input
                id="speedControl"
                type="range"
                min="5"
                max="20"
                value={speed}
                onChange={e => setSpeed(Number(e.target.value))}
                className="w-full accent-cyan-900 h-2 rounded-lg appearance-none bg-gray-300 outline-none transition-all duration-200 dark-slider"
              />
              <span className="text-cyan-900 text-xs mt-1 font-semibold">{speed}</span>
            </div>
            {/* Color Customizer */}
            <div className="flex flex-col items-end mt-2 w-full gap-2">
              <label className="text-cyan-900 text-sm font-medium">Snake Color:
                <input
                  type="color"
                  value={snakeColor}
                  onChange={e => setSnakeColor(e.target.value)}
                  className="ml-2 w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                  title="Pick snake color"
                />
              </label>
              <label className="text-cyan-900 text-sm font-medium">Head Color:
                <input
                  type="color"
                  value={snakeHeadColor}
                  onChange={e => setSnakeHeadColor(e.target.value)}
                  className="ml-2 w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                  title="Pick snake head color"
                />
              </label>
            </div>
            {/* Pause/Resume Button */}
            <button
              onClick={() => setPaused(p => !p)}
              className="mt-2 px-4 py-2 bg-cyan-700 text-white rounded-lg font-bold text-base shadow hover:bg-cyan-800 transition-colors duration-200 w-full"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            {/* Bonus Indicator */}
            <div className="mt-2 p-2 bg-cyan-100/80 rounded text-cyan-900 text-xs w-full shadow-inner">
              <div className="font-bold mb-1">Controls:</div>
              <div className="flex flex-col gap-1">
                <span>⬆️ ⬇️ ⬅️ ➡️ — Move Snake</span>
                <span><kbd className="px-1 py-0.5 bg-gray-200 rounded border">Space</kbd> — Pause/Resume</span>
              </div>
            </div>
            {showBonus && (
              <div className="mt-2 text-xs text-yellow-600 font-semibold">Bonus active!</div>
            )}
          </div>
        </div>
      </div>
      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed z-10 inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center text-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-11/12 max-w-xs sm:max-w-md flex flex-col items-center border-4 border-cyan-700 relative">
            <div className="text-5xl mb-2">💀</div>
            <h2 className="text-3xl font-extrabold text-cyan-800 mb-2 tracking-wide">Game Over</h2>
            <div className="flex flex-col items-center mb-4 w-full">
              <div className="text-cyan-700 font-bold text-xl">Score: {score}</div>
              <div className="text-cyan-900 font-semibold text-base">High Score: {highScore}</div>
            </div>
            <button
              onClick={handleRestart}
              className="px-8 py-2 bg-cyan-700 text-white rounded-lg font-bold text-lg shadow hover:bg-cyan-800 transition-colors duration-200 mt-2"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      {/* Audio elements */}
      <audio ref={moveSound} src={`${import.meta.env.BASE_URL}music/move2.mp3`} preload="auto" />
      <audio ref={foodSound} src={`${import.meta.env.BASE_URL}music/eat.mp3`} preload="auto" />
      <audio ref={gameOverSound} src={`${import.meta.env.BASE_URL}music/gameover2.wav`} preload="auto" />
    </div>
  );
}