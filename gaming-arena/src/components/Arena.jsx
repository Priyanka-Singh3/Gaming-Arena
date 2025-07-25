import { Link } from "react-router-dom";

export default function Arena() {
  return (
    <div className="bg-gradient-to-br from-cyan-100 to-blue-200 min-h-screen flex flex-col items-center pb-10" style={{ fontFamily: 'Outfit',  fontWeight: 300}}>
      <h1 className="text-4xl font-extrabold text-cyan-900 mt-10 mb-8 tracking-wide" style={{ fontFamily: 'Bitcount', fontWeight: 500 }}>Gaming Arena</h1>
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
        {/* Snake Game Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <img src={`${import.meta.env.BASE_URL}snake_.png`} alt="Snake Game" className="rounded-xl w-48 h-48 object-cover mb-4 shadow"/>
          <h2 className="text-2xl font-bold text-cyan-800 mb-2">Snake Game</h2>
          <p className="text-gray-700 mb-4 text-center">
            Classic snake game . Eat, grow, and beat your high score!
          </p>
          <div className="mb-1">
          <Link to="/snake" className="px-6 py-2 bg-cyan-700 text-white rounded-lg font-bold text-lg shadow hover:bg-cyan-800 transition-colors duration-200">
            Play
          </Link>
          </div>
        </div>
        {/* Memory Game Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <div className="rounded-xl w-48 h-48 bg-pink-100 flex items-center justify-center mb-4 text-6xl shadow">🧠</div>
          <h2 className="text-2xl font-bold text-pink-800 mb-2">Memory Game</h2>
          <p className="text-gray-700 mb-4 text-center">
            Flip cards to find all the matching pairs. Test your memory !
          </p>
          <div className="mb-1">
          <Link to="/memory" className="px-6 py-2 bg-pink-600 text-white rounded-lg font-bold text-lg shadow hover:bg-pink-700 transition-colors duration-200">
            Play
          </Link>
          </div>
        </div>
        {/* Tic Tac Toe Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <div className="rounded-xl w-48 h-48 bg-yellow-100 flex items-center justify-center mb-4 text-6xl shadow">❌⭕</div>
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">Tic Tac Toe</h2>
          <p className="text-gray-700 mb-4 text-center">
            Classic two-player Tic Tac Toe. Play X and O, and see who wins! 
          </p>
          <div className="mb-1">
          <Link to="/tictactoe" className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-bold text-lg shadow hover:bg-yellow-600 transition-colors duration-200">
            Play
          </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center hover:scale-105 transition-transform duration-200">
          <div className="rounded-xl w-48 h-48 bg-red-100 flex items-center justify-center mb-4 text-3xl shadow"> ✊ ✋ ✌️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Rock Paper Scissors</h2>
          <p className="text-gray-700 mb-4 text-center">
          Multiplayer Rock Paper Scissors. Play with your friends!
          </p>
          <div className="mb-1">
          <Link to="/rockpaperscissors" className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold text-lg shadow hover:bg-yellow-600 transition-colors duration-200">
            Play
          </Link>
          </div>
        </div>
        {/* Coming Soon Card 1 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center opacity-70 cursor-not-allowed">
          <div className="rounded-xl w-48 h-48 bg-gray-200 flex items-center justify-center mb-4 text-5xl text-gray-400">🎮</div>
          <h2 className="text-2xl font-bold text-gray-500 mb-2">Game</h2>
          <p className="text-gray-400 mb-4 text-center">A new exciting game is on the way. Stay tuned!</p>
          <span className="px-6 py-2 bg-gray-400 text-white rounded-lg font-bold text-lg shadow">Coming Soon</span>
        </div>
        {/* Coming Soon Card 2 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center opacity-70 cursor-not-allowed">
          <div className="rounded-xl w-48 h-48 bg-gray-200 flex items-center justify-center mb-4 text-5xl text-gray-400">🕹️</div>
          <h2 className="text-2xl font-bold text-gray-500 mb-2">Game</h2>
          <p className="text-gray-400 mb-4 text-center">Another fun game will be available soon. Check back later!</p>
          <span className="px-6 py-2 bg-gray-400 text-white rounded-lg font-bold text-lg shadow">Coming Soon</span>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 w-80 flex flex-col items-center opacity-70 cursor-not-allowed">
          <div className="rounded-xl w-48 h-48 bg-gray-200 flex items-center justify-center mb-4 text-5xl text-gray-400">🕹️</div>
          <h2 className="text-2xl font-bold text-gray-500 mb-2">Game</h2>
          <p className="text-gray-400 mb-4 text-center">Another fun game will be available soon. Check back later!</p>
          <span className="px-6 py-2 bg-gray-400 text-white rounded-lg font-bold text-lg shadow">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}