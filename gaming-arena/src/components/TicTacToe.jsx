import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const emptyBoard = Array(9).fill(null);

// const socket = io("https://gaming-arena-0ont.onrender.com");
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true
});
// Store socket id for symbol assignment after rematch
const getSocketId = () => socket.id;

export default function TicTacToe() {
  const [joined, setJoined] = useState(false);
  const [room, setRoom] = useState("");
  const [inputRoom, setInputRoom] = useState("");
  const [players, setPlayers] = useState(1);
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [symbol, setSymbol] = useState(null);
  const [winner, setWinner] = useState(null);
  const [line, setLine] = useState([]);
  const [isDraw, setIsDraw] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [roomFull, setRoomFull] = useState(false);
  const [rematchOffer, setRematchOffer] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    setSocketId(getSocketId());
    socket.on("ttt-players", (numOrList) => {
      // Support both number and array for backward compatibility
      if (Array.isArray(numOrList)) {
        setPlayerList(numOrList);
        setPlayers(numOrList.length);
        // Assign symbol based on position in playerList
        const idx = numOrList.indexOf(getSocketId());
        setSymbol(idx === 0 ? "X" : idx === 1 ? "O" : null);
        console.log('[TicTacToe] ttt-players event:', numOrList, 'players:', numOrList.length, 'my socket:', getSocketId());
      } else {
        setPlayers(numOrList);
        console.log('[TicTacToe] ttt-players event (number):', numOrList);
      }
    });
    socket.on("ttt-roomFull", () => {
      setRoomFull(true);
      setJoined(false);
    });
    socket.on("ttt-init", ({ board, xIsNext, symbol: newSymbol, gameActive }) => {
      setBoard(board);
      setXIsNext(xIsNext);
      // Only update symbol if provided (for initial join)
      if (newSymbol) {
        setSymbol(newSymbol);
      }
      setGameActive(gameActive);
      setWinner(null);
      setLine([]);
      setIsDraw(false);
      setJoined(true);
      console.log('[TicTacToe] ttt-init event received.');
    });
    socket.on("ttt-update", ({ board, xIsNext, winner, line, isDraw, gameActive }) => {
      setBoard([...board]);
      setXIsNext(xIsNext);
      setWinner(winner);
      setLine(line || []);
      setIsDraw(isDraw);
      setGameActive(gameActive);
    });
    socket.on("ttt-rematch-offer", () => {
      setRematchOffer(true);
    });
    return () => {
      socket.off("ttt-players");
      socket.off("ttt-roomFull");
      socket.off("ttt-init");
      socket.off("ttt-update");
      socket.off("ttt-rematch-offer");
    };
  }, []);

  useEffect(() => {
    console.log('[TicTacToe] players state updated:', players, 'playerList:', playerList);
  }, [players, playerList]);

  function handleJoinRoom(e) {
    e.preventDefault();
    if (!inputRoom) return;
    setRoomFull(false);
    setRoom(inputRoom);
    socket.emit("ttt-joinRoom", inputRoom);
  }

  function handleMove(idx) {
    if (!gameActive || board[idx] || winner || symbol !== (xIsNext ? "X" : "O")) return;
    socket.emit("ttt-move", { roomCode: room, idx });
  }

  function handleLeaveRoom() {
    socket.emit("ttt-leaveRoom", room);
    setJoined(false);
    setRoom("");
    setInputRoom("");
    setPlayers(1);
    setBoard(emptyBoard);
    setXIsNext(true);
    setSymbol(null);
    setWinner(null);
    setLine([]);
    setIsDraw(false);
    setGameActive(true);
    setRoomFull(false);
  }

  function handlePlayAgain() {
    socket.emit("ttt-rematch-request", room);
  }
  function handleAcceptRematch() {
    setRematchOffer(false);
    socket.emit("ttt-rematch-request", room);
  }
  function handleDeclineRematch() {
    setRematchOffer(false);
    handleLeaveRoom();
  }

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-100 py-10 px-4 font-sans">
        <h2 className="text-4xl font-extrabold text-pink-800 mb-8 tracking-wide drop-shadow">Tic Tac Toe</h2>
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-100 py-10 px-4 font-sans">
      {/* Leave Room Button - Above Title, Centered */}
      <button
        onClick={handleLeaveRoom}
        className="mb-4 px-4 py-1 bg-pink-200 text-pink-800 rounded-full font-semibold text-base shadow hover:bg-pink-300 transition-colors duration-200"
        style={{ alignSelf: 'center' }}
        title="Leave Room"
      >
        Leave Room
      </button>
      <h2 className="text-4xl font-extrabold text-pink-800 mb-4 tracking-wide drop-shadow">Tic Tac Toe</h2>
      <div className="mb-2 text-pink-700 font-bold">Room: {room}</div>
      <div className="mb-2 text-pink-600">Players in room: {players} / 2</div>
      <div className="mb-4 text-pink-700 font-semibold">You are: {symbol || "-"}</div>
      {players < 2 && (
        <div className="mb-8 text-lg text-pink-500">Waiting for opponent to join...</div>
      )}
      <div className="grid grid-cols-3 gap-2 mb-6 w-72 sm:w-80 transition-all duration-300">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className={`w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl shadow-lg flex items-center justify-center text-3xl sm:text-5xl font-extrabold transition-colors duration-200
              ${line.includes(idx) ? "bg-pink-300 text-white animate-pulse" : "text-pink-700"}
              ${cell || winner || !gameActive ? "cursor-default" : "hover:bg-pink-100"}
              ${winner && !line.includes(idx) ? "opacity-60" : ""}
            `}
            onClick={() => handleMove(idx)}
            disabled={!!cell || !!winner || !gameActive || players < 2 || symbol !== (xIsNext ? "X" : "O")}
          >
            {cell}
          </button>
        ))}
      </div>
      <p className="mb-6 text-lg text-pink-700">
        {winner
          ? `🎉 Winner: ${winner}`
          : isDraw
          ? "😐 It's a draw!"
          : !gameActive
          ? "Game over."
          : players < 2
          ? "Waiting for opponent..."
          : symbol !== (xIsNext ? "X" : "O")
          ? "Wait for your turn..."
          : `🔁 Your turn (${symbol})`}
      </p>
      {(winner || isDraw || !gameActive) && !rematchOffer && (
        <button
          onClick={handlePlayAgain}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg font-bold text-lg shadow hover:bg-pink-700 transition-colors duration-200"
        >
          Play Again
        </button>
      )}
      {rematchOffer && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white border-2 border-pink-400 rounded-xl shadow-lg px-8 py-4 flex flex-col items-center">
            <div className="text-base font-bold text-pink-700 mb-3">
              The other player wants to play again.<br />
              Do you want to play again or leave the room?
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAcceptRematch}
                className="px-4 py-1 bg-pink-600 text-white rounded font-bold shadow hover:bg-pink-700 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={handleDeclineRematch}
                className="px-4 py-1 bg-gray-300 text-pink-800 rounded font-bold shadow hover:bg-gray-400 transition-colors"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
