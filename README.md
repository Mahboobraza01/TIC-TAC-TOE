# 🎮 Tic Tac Toe

A responsive, browser-based Tic Tac Toe game built with vanilla HTML, CSS, and JavaScript — no frameworks, no libraries, no build tools. Play locally with a friend or challenge an unbeatable computer opponent powered by the **Minimax algorithm**.

## ✨ Features

- **Two game modes**
  - 👥 Play with Friend — two players on the same device
  - 🤖 Play vs Computer — unbeatable AI opponent
- **Win detection** across all 8 possible combinations (rows, columns, diagonals)
- **Winning line highlight** — visual feedback when a player wins
- **Live scoreboard** — tracks X wins, O wins, and draws for the session
- **Reset button** — start a new round anytime
- **Responsive, clean UI** with hover states

## 🧠 How the Computer Plays

The computer opponent uses the **Minimax algorithm** — a classical game-tree search technique (not machine learning). For every possible move, it recursively simulates the rest of the game to its end, assuming both players play optimally, and picks the move that leads to the best guaranteed outcome. Because the search space is small (max 9 cells), this makes the computer **unbeatable** — the best a human can achieve is a draw.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (Flexbox + CSS Grid) |
| Logic | JavaScript (ES6, Vanilla) |
| Rendering | Native DOM manipulation |

No backend, no database, no dependencies — pure static site.

## 📁 Project Structure

```
├── index.html      # Markup: board, mode selector, scoreboard
├── style.css       # Styling and layout
└── script.js       # Game logic, win detection, minimax AI
```

## 🚀 Running Locally

1. Clone or download this repository
2. Open `index.html` in any modern browser

No installation or build step required.

## 🔮 Future Improvements

- [ ] Alpha-beta pruning for optimized minimax performance
- [ ] Difficulty levels (easy = random AI, hard = minimax AI)
- [ ] Persist scores with `localStorage`
- [ ] Animations for moves and wins

## 👤 Author

**Mahboob Raza**
