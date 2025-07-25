import { useState, useEffect } from "react";
import rock from "../assets/rock.png";
import paper from "../assets/paper.png";
import scissor from "../assets/scissor.png";
import { io } from "socket.io-client";

const choices = ["Rock", "Paper", "Scissors"];
const handImages = {
  Rock: rock,
  Paper: paper,
  Scissors: scissor,
};

const socket = io("ws://localhost:4000");

export default function RockPaperScissors() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState(1);
  const [choice, setChoice] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [result, setResult] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [inputRoom, setInputRoom] = useState("");
  const [roomFull, setRoomFull] = useState(false);

  useEffect(() => {
    socket.on("players", (num) => {
      setPlayers(num);
    });
    socket.on("result", ({ yourChoice, opponentChoice, result }) => {
      setResult(result);
      setOpponentChoice(opponentChoice);
      setWaiting(false);
    });
    socket.on("roomFull", () => {
      setRoomFull(true);
      setJoined(false);
    });
    return () => {
      socket.off("players");
      socket.off("result");
      socket.off("roomFull");
    };
  }, []);

  function handleJoinRoom(e) {
    e.preventDefault();
    if (!inputRoom) return;
    setRoomFull(false);
    setRoom(inputRoom);
    socket.emit("joinRoom", inputRoom);
    setJoined(true);
  }

  function handlePlay(choice) {
    setChoice(choice);
    setWaiting(true);
    socket.emit("choice", choice);
  }

  function handleLeaveRoom() {
    socket.emit("leaveRoom", room);
    setJoined(false);
    setRoom("");
    setPlayers(1);
    setChoice(null);
    setWaiting(false);
    setResult(null);
    setOpponentChoice(null);
    setInputRoom("");
    setRoomFull(false);
  }

  function resetGame() {
    setChoice(null);
    setResult(null);
    setOpponentChoice(null);
    setWaiting(false);
  }

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200 py-10 px-4 font-sans">
        <h2 className="text-5xl font-extrabold text-pink-800 mb-8 tracking-tight drop-shadow">
          Rock Paper Scissors
        </h2>
        <form onSubmit={handleJoinRoom} className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter Room Code"
            value={inputRoom}
            onChange={e => setInputRoom(e.target.value)}
            className="px-4 py-2 rounded border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-pink-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-pink-700 transition-colors duration-200"
          >
            Join Room
          </button>
          {roomFull && (
            <div className="text-red-600 font-bold mt-2">Room is full. Please try another room.</div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200 py-10 px-4 font-sans">
      <h2 className="text-5xl font-extrabold text-pink-800 mb-4 tracking-tight drop-shadow">
        Rock Paper Scissors
      </h2>
      <div className="mb-2 text-pink-700 font-bold">Room: {room}</div>
      <div className="mb-6 text-pink-600">Players in room: {players} / 2</div>
      <button
        onClick={handleLeaveRoom}
        className="mb-6 px-4 py-1 bg-pink-200 text-pink-800 rounded-full font-semibold text-base shadow hover:bg-pink-300 transition-colors duration-200"
        style={{ alignSelf: 'flex-end' }}
      >
        Leave Room
      </button>
      {players < 2 && (
        <div className="mb-8 text-lg text-pink-500">Waiting for opponent to join...</div>
      )}
      {players === 2 && !choice && !result && (
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-pink-700 mb-2">Pick your hand</span>
          <div className="flex flex-wrap gap-6 justify-center">
            {choices.map((c) => (
              <button
                key={c}
                onClick={() => handlePlay(c)}
                className="flex flex-col items-center hover:scale-110 transition-transform duration-200"
              >
                <img
                  src={handImages[c]}
                  alt={c}
                  className="w-24 h-24 sm:w-28 sm:h-28 mb-2 drop-shadow-md hover:drop-shadow-xl transition-all duration-200"
                />
                <span className="text-lg font-bold text-pink-700">{c}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {waiting && !result && (
        <div className="mt-8 text-xl text-pink-700 font-bold">Waiting for opponent's choice...</div>
      )}
      {result && (
        <>
          <div className="flex items-center justify-center gap-12 mb-10 animate-fade-in">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-pink-600 mb-2">You</span>
              <img
                src={handImages[choice]}
                alt={choice}
                className="w-28 h-28 drop-shadow-md animate-scale-in"
              />
            </div>
            <span className="text-3xl font-bold text-pink-700">VS</span>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-pink-600 mb-2">Opponent</span>
              <img
                src={handImages[opponentChoice]}
                alt={opponentChoice}
                className="w-28 h-28 drop-shadow-md animate-scale-in"
              />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-pink-900 mb-6 transition-opacity duration-300 animate-fade-in">
            {result}
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-pink-600 text-white rounded-full font-bold text-lg shadow-lg hover:bg-pink-700 transition-colors duration-200"
          >
            Play Again
          </button>
        </>
      )}
    </div>
  );
}
