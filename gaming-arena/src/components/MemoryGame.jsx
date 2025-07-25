import { useState, useEffect } from "react";

const CARD_IMAGES = [
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f354.png", alt: "Burger" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f355.png", alt: "Pizza" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f366.png", alt: "Ice Cream" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f36a.png", alt: "Cookie" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f36d.png", alt: "Lollipop" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f370.png", alt: "Cake" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34e.png", alt: "Apple" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34a.png", alt: "Orange" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f353.png", alt: "Strawberry" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f349.png", alt: "Watermelon" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f36c.png", alt: "Candy" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f382.png", alt: "Birthday Cake" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f36b.png", alt: "Chocolate Bar" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f37f.png", alt: "Popcorn" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f95e.png", alt: "Pancakes" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f9c0.png", alt: "Cheese" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f35f.png", alt: "Fries" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f32e.png", alt: "Taco" },
  { src: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f32f.png", alt: "Burrito" }
];

const LEVELS = {
  easy: 6,
  medium: 12,
  hard: 18
};

function shuffleArray(array) {
  return array
    .concat(array)
    .map((item) => ({ ...item, id: Math.random() }))
    .sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const [level, setLevel] = useState("easy");
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    startGame(level);
    // eslint-disable-next-line
  }, [level]);

  function startGame(selectedLevel = level) {
    const numPairs = LEVELS[selectedLevel];
    const selectedImages = CARD_IMAGES.slice(0, numPairs);
    setCards(shuffleArray(selectedImages));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setDisabled(false);
  }

  function handleCardClick(index) {
    if (disabled || flipped.includes(index) || matched.includes(cards[index].src)) return;
    if (flipped.length === 0) {
      setFlipped([index]);
    } else if (flipped.length === 1) {
      setFlipped([flipped[0], index]);
      setDisabled(true);
      setMoves((m) => m + 1);
      if (cards[flipped[0]].src === cards[index].src) {
        setTimeout(() => {
          setMatched((prev) => [...prev, cards[index].src]);
          setFlipped([]);
          setDisabled(false);
        }, 700);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
        }, 1000);
      }
    }
  }

  function handleLevelChange(e) {
    setLevel(e.target.value);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-cyan-100 py-10">
      <h2 className="text-4xl font-extrabold text-cyan-900 mb-4 tracking-wide">Memory Game</h2>
      <p className="mb-2 text-lg text-cyan-800">Flip cards to find all the matching pairs!</p>
      <div className="mb-6 flex items-center gap-4">
        <label className="font-semibold text-cyan-900">Level:</label>
        <select
          value={level}
          onChange={handleLevelChange}
          className="px-3 py-1 rounded-lg border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white text-cyan-900 font-bold shadow"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div
        className={`grid mb-6 mx-auto
          ${level === "easy" ? "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4" : ""}
          ${level === "medium" ? "grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 sm:gap-3" : ""}
          ${level === "hard" ? "grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-1 sm:gap-3" : ""}
          max-w-full
        `}
        style={{
          maxWidth: "100vw"
        }}
      >
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.src);
          let cardSize = "";
          if (level === "easy") cardSize = "w-16 h-20 xs:w-20 xs:h-28 sm:w-24 sm:h-32"; // 64x80, 80x112, 96x128
          else if (level === "medium") cardSize = "w-12 h-16 xs:w-14 xs:h-20 sm:w-16 sm:h-24 md:w-20 md:h-28"; // 48x64, 56x80, 64x96, 80x112
          else cardSize = "w-10 h-14 xs:w-12 xs:h-16 sm:w-14 sm:h-20 md:w-16 md:h-24"; // 40x56, 48x64, 56x80, 64x96
          return (
            <button
              key={card.id}
              className={`${cardSize} bg-white rounded-xl shadow-lg flex items-center justify-center transition-transform duration-200 ${isFlipped ? "scale-105" : "hover:scale-105"}`}
              onClick={() => handleCardClick(idx)}
              disabled={isFlipped || disabled}
              style={{ perspective: 600 }}
            >
              <div className={`relative w-full h-full transition-transform duration-300 ${isFlipped ? "rotate-y-180" : ""}`}
                style={{ transformStyle: "preserve-3d" }}>
                {/* Front (image) */}
                <img
                  src={card.src}
                  alt={card.alt}
                  className="absolute w-full h-full object-contain rounded-xl backface-hidden"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                />
                {/* Back (cover) */}
                <div
                  className="absolute w-full h-full bg-cyan-200 rounded-xl flex items-center justify-center text-2xl sm:text-4xl font-bold backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >❓</div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-6 mb-4">
        <span className="text-lg font-semibold text-cyan-900">Moves: {moves}</span>
        <button
          onClick={() => startGame(level)}
          className="px-5 py-2 bg-cyan-700 text-white rounded-lg font-bold text-lg shadow hover:bg-cyan-800 transition-colors duration-200"
        >
          Reset
        </button>
      </div>
      {matched.length === LEVELS[level] && (
        <div className="mt-4 text-2xl font-bold text-green-700">🎉 You found all pairs in {moves} moves!</div>
      )}
    </div>
  );
}
