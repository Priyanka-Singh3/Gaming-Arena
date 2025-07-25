const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: 'https://gaming-arena-seven.vercel.app', // Allow all origins (for production, specify your frontend URL)
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions
});

const PORT = 4000;

// Room state: { [roomCode]: { players: [socketId, ...], choices: { [socketId]: 'Rock'|'Paper'|'Scissors' } } }
const rooms = {};

// --- Tic Tac Toe Multiplayer Logic ---
const tttRooms = {};
// Track rematch requests: { [roomCode]: Set<socketId> }
const tttRematchRequests = {};

function getTTTWinner(board) {
  const WIN_PATTERNS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

io.on('connection', (socket) => {
  let currentRoom = null;

  socket.on('joinRoom', (roomCode) => {
    currentRoom = roomCode;
    if (!rooms[roomCode]) {
      rooms[roomCode] = { players: [], choices: {} };
    }
    if (!rooms[roomCode].players.includes(socket.id)) {
      if (rooms[roomCode].players.length >= 2) {
        socket.emit('roomFull');
        return;
      }
      rooms[roomCode].players.push(socket.id);
    }
    io.to(roomCode).emit('players', rooms[roomCode].players.length);
    socket.join(roomCode);
    io.to(roomCode).emit('players', rooms[roomCode].players.length);
  });

  socket.on('choice', (choice) => {
    if (!currentRoom || !rooms[currentRoom]) return;
    rooms[currentRoom].choices[socket.id] = choice;
    // Wait for both players
    if (Object.keys(rooms[currentRoom].choices).length === 2) {
      const [p1, p2] = rooms[currentRoom].players;
      const c1 = rooms[currentRoom].choices[p1];
      const c2 = rooms[currentRoom].choices[p2];
      // Determine result
      let result1, result2;
      if (c1 === c2) {
        result1 = result2 = 'Draw!';
      } else if (
        (c1 === 'Rock' && c2 === 'Scissors') ||
        (c1 === 'Paper' && c2 === 'Rock') ||
        (c1 === 'Scissors' && c2 === 'Paper')
      ) {
        result1 = 'You Win!';
        result2 = 'You Lose!';
      } else {
        result1 = 'You Lose!';
        result2 = 'You Win!';
      }
      // Emit results
      io.to(p1).emit('result', { yourChoice: c1, opponentChoice: c2, result: result1 });
      io.to(p2).emit('result', { yourChoice: c2, opponentChoice: c1, result: result2 });
      // Reset choices for next round
      rooms[currentRoom].choices = {};
    }
  });

  socket.on('leaveRoom', (roomCode) => {
    if (roomCode && rooms[roomCode]) {
      rooms[roomCode].players = rooms[roomCode].players.filter(id => id !== socket.id);
      delete rooms[roomCode].choices[socket.id];
      io.to(roomCode).emit('players', rooms[roomCode].players.length);
      socket.leave(roomCode);
      if (rooms[roomCode].players.length === 0) {
        delete rooms[roomCode];
      }
    }
    if (currentRoom === roomCode) {
      currentRoom = null;
    }
  });

  socket.on('disconnect', () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].players = rooms[currentRoom].players.filter(id => id !== socket.id);
      delete rooms[currentRoom].choices[socket.id];
      io.to(currentRoom).emit('players', rooms[currentRoom].players.length);
      // Clean up empty rooms
      if (rooms[currentRoom].players.length === 0) {
        delete rooms[currentRoom];
      }
    }
  });

  // --- Tic Tac Toe Events ---
  let tttCurrentRoom = null;
  let tttPlayerSymbol = null;

  socket.on('ttt-joinRoom', (roomCode) => {
    tttCurrentRoom = roomCode;
    if (!tttRooms[roomCode]) {
      tttRooms[roomCode] = {
        players: [],
        board: Array(9).fill(null),
        xIsNext: true,
        gameActive: true,
      };
    }
    if (!tttRooms[roomCode].players.includes(socket.id)) {
      if (tttRooms[roomCode].players.length >= 2) {
        socket.emit('ttt-roomFull');
        return;
      }
      tttRooms[roomCode].players.push(socket.id);
    }
    tttPlayerSymbol = tttRooms[roomCode].players.indexOf(socket.id) === 0 ? 'X' : 'O';
    socket.join(roomCode);
    io.to(roomCode).emit('ttt-players', [...tttRooms[roomCode].players]);
    // Send initial state
    socket.emit('ttt-init', {
      board: tttRooms[roomCode].board,
      xIsNext: tttRooms[roomCode].xIsNext,
      symbol: tttPlayerSymbol,
      gameActive: tttRooms[roomCode].gameActive,
    });
    // After join, emit player list again to ensure all are in sync
    setTimeout(() => {
      io.to(roomCode).emit('ttt-players', [...tttRooms[roomCode].players]);
    }, 100);
  });

  socket.on('ttt-move', ({ roomCode, idx }) => {
    const room = tttRooms[roomCode];
    if (!room || !room.gameActive) return;
    const playerIdx = room.players.indexOf(socket.id);
    const symbol = playerIdx === 0 ? 'X' : playerIdx === 1 ? 'O' : null;
    if (symbol !== (room.xIsNext ? 'X' : 'O')) return; // Not your turn
    if (room.board[idx] || getTTTWinner(room.board).winner) return;
    room.board[idx] = symbol;
    room.xIsNext = !room.xIsNext;
    const { winner, line } = getTTTWinner(room.board);
    const isDraw = !winner && room.board.every(Boolean);
    if (winner || isDraw) room.gameActive = false;
    io.to(roomCode).emit('ttt-update', {
      board: room.board,
      xIsNext: room.xIsNext,
      winner,
      line,
      isDraw,
      gameActive: room.gameActive,
    });
  });

  socket.on('ttt-rematch-request', (roomCode) => {
    const room = tttRooms[roomCode];
    if (!room) return;
    if (!tttRematchRequests[roomCode]) tttRematchRequests[roomCode] = new Set();
    tttRematchRequests[roomCode].add(socket.id);
    // If both players requested rematch, reset board for both
    if (tttRematchRequests[roomCode].size === 2) {
      room.board = Array(9).fill(null);
      room.xIsNext = true;
      room.gameActive = true;
      io.to(roomCode).emit('ttt-init', {
        board: room.board,
        xIsNext: room.xIsNext,
        symbol: null,
        gameActive: room.gameActive,
      });
      tttRematchRequests[roomCode].clear();
    } else {
      // Notify the other player
      const otherId = room.players.find(id => id !== socket.id);
      if (otherId) io.to(otherId).emit('ttt-rematch-offer');
    }
  });

  socket.on('ttt-leaveRoom', (roomCode) => {
    if (roomCode && tttRooms[roomCode]) {
      tttRooms[roomCode].players = tttRooms[roomCode].players.filter(id => id !== socket.id);
      socket.leave(roomCode);
      io.to(roomCode).emit('ttt-players', [...tttRooms[roomCode].players]);
      if (tttRematchRequests[roomCode]) tttRematchRequests[roomCode].delete(socket.id);
      if (tttRooms[roomCode].players.length === 0) {
        delete tttRooms[roomCode];
        delete tttRematchRequests[roomCode];
      }
    }
    if (tttCurrentRoom === roomCode) {
      tttCurrentRoom = null;
      tttPlayerSymbol = null;
    }
  });

  socket.on('ttt-reset', (roomCode) => {
    const room = tttRooms[roomCode];
    if (room) {
      room.board = Array(9).fill(null);
      room.xIsNext = true;
      room.gameActive = true;
      io.to(roomCode).emit('ttt-init', {
        board: room.board,
        xIsNext: room.xIsNext,
        symbol: null, // frontend will reassign
        gameActive: room.gameActive,
      });
      if (tttRematchRequests[roomCode]) tttRematchRequests[roomCode].clear();
    }
  });

  // On disconnect, also leave TTT room
  socket.on('disconnect', () => {
    if (tttCurrentRoom && tttRooms[tttCurrentRoom]) {
      tttRooms[tttCurrentRoom].players = tttRooms[tttCurrentRoom].players.filter(id => id !== socket.id);
      io.to(tttCurrentRoom).emit('ttt-players', [...tttRooms[tttCurrentRoom].players]);
      if (tttRematchRequests[tttCurrentRoom]) tttRematchRequests[tttCurrentRoom].delete(socket.id);
      if (tttRooms[tttCurrentRoom].players.length === 0) {
        delete tttRooms[tttCurrentRoom];
        delete tttRematchRequests[tttCurrentRoom];
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});