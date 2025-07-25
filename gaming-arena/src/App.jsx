import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Arena from "./components/Arena";
import SnakeGame from "./components/SnakeGame";
import MemoryGame from "./components/MemoryGame";
import TicTacToe from "./components/TicTacToe";
import RockPaperScissors from "./components/RockPaperScissors";

export default function App() {
  return (
    <Router basename="/">
      <Navbar />
      <Routes>
        <Route path="/" element={<Arena />} />
        <Route path="/snake" element={<SnakeGame />} />
        <Route path="/memory" element={<MemoryGame />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
        <Route path="/rockpaperscissors" element={<RockPaperScissors />} />
      </Routes>
    </Router>
  );
}