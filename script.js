document.addEventListener('DOMContentLoaded', () => {
  // ===== Screens =====
  const setupScreen = document.getElementById('setupScreen');
  const gameScreen = document.getElementById('gameScreen');

  // ===== Setup screen elements =====
  const markToggle = document.getElementById('markToggle');
  const toggleBtns = markToggle.querySelectorAll('.toggle-btn');
  const startCpuBtn = document.getElementById('startCpuBtn');
  const startFriendBtn = document.getElementById('startFriendBtn');

  // ===== Game screen elements =====
  const homeBtn = document.getElementById('homeBtn');
  const resetBtn = document.getElementById('resetBtn');
  const turnIcon = document.getElementById('turnIcon');
  const cells = document.querySelectorAll('.cell');
  const messageEl = document.getElementById('message');

  const scoreXLabel = document.getElementById('scoreXLabel');
  const scoreOLabel = document.getElementById('scoreOLabel');
  const scoreXValue = document.getElementById('scoreXValue');
  const scoreOValue = document.getElementById('scoreOValue');
  const scoreDrawValue = document.getElementById('scoreDrawValue');

  // ===== Icons =====
  const xIconSVG = () =>
    `<svg viewBox="0 0 24 24" class="mark-icon mark-x"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>`;
  const oIconSVG = () =>
    `<svg viewBox="0 0 24 24" class="mark-icon mark-o"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="4"/></svg>`;

  // ===== State =====
  let humanMark = 'X';       // mark chosen by player 1 on setup screen
  let cpuMark = 'O';
  let vsMode = 'cpu';        // 'cpu' or 'friend'
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';   // X always goes first
  let isGameActive = true;

  let score = { X: 0, O: 0, draw: 0 };

  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  // ===== Setup screen: mark toggle =====
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      humanMark = btn.getAttribute('data-mark');
      cpuMark = humanMark === 'X' ? 'O' : 'X';
    });
  });

  startCpuBtn.addEventListener('click', () => {
    vsMode = 'cpu';
    startGame();
  });

  startFriendBtn.addEventListener('click', () => {
    vsMode = 'friend';
    startGame();
  });

  homeBtn.addEventListener('click', () => {
    score = { X: 0, O: 0, draw: 0 };
    gameScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
  });

  resetBtn.addEventListener('click', () => {
    resetBoard();
  });

  // ===== Start / setup a new game =====
  function startGame() {
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    updateLabels();
    resetBoard();
  }

  function updateLabels() {
    if (vsMode === 'cpu') {
      scoreXLabel.textContent = humanMark === 'X' ? 'X (You)' : 'X (CPU)';
      scoreOLabel.textContent = humanMark === 'O' ? 'O (You)' : 'O (CPU)';
    } else {
      scoreXLabel.textContent = 'X';
      scoreOLabel.textContent = 'O';
    }
  }

  function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    messageEl.textContent = '';
    messageEl.className = 'message';
    cells.forEach(c => {
      c.innerHTML = '';
      c.classList.remove('winning');
    });
    updateTurnIndicator();

    // If computer is X, it goes first
    if (vsMode === 'cpu' && currentPlayer === cpuMark) {
      setTimeout(cpuMove, 400);
    }
  }

  // ===== Cell click (human move) =====
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));

  function handleCellClick(e) {
    const cell = e.currentTarget;
    const index = parseInt(cell.getAttribute('data-index'));

    if (!isGameActive || board[index] !== '') return;
    if (vsMode === 'cpu' && currentPlayer !== humanMark) return; // not human's turn

    playMove(index, currentPlayer);

    if (isGameActive) {
      switchTurn();
      if (vsMode === 'cpu' && currentPlayer === cpuMark) {
        setTimeout(cpuMove, 400);
      }
    }
  }

  function switchTurn() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
  }

  function updateTurnIndicator() {
    turnIcon.innerHTML = currentPlayer === 'X' ? xIconSVG() : oIconSVG();
  }

  // ===== Apply a move to board + UI, then check result =====
  function playMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.innerHTML = player === 'X' ? xIconSVG() : oIconSVG();
    checkResult();
  }

  function checkResult() {
    let roundWon = false;
    let winLine = null;

    for (let combo of winningConditions) {
      const [a, b, c] = combo;
      if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
        roundWon = true;
        winLine = combo;
        break;
      }
    }

    if (roundWon) {
      highlightWinning(winLine);
      const winType = currentPlayer === 'X' ? 'win-x' : 'win-o';
      showResultMessage(winnerMessage(currentPlayer), winType);
      isGameActive = false;
      updateScore(currentPlayer);
      return;
    }

    if (!board.includes('')) {
      showResultMessage("It's a draw!", 'draw');
      isGameActive = false;
      updateScore('draw');
    }
  }

  function showResultMessage(text, type) {
    messageEl.textContent = text;
    // reset animation so it replays even if the same class is reapplied
    messageEl.className = 'message';
    void messageEl.offsetWidth; // force reflow
    messageEl.className = `message show ${type}`;
  }

  function winnerMessage(winner) {
    if (vsMode === 'cpu') {
      return winner === humanMark ? 'You win!' : 'Computer wins!';
    }
    return `Player ${winner} wins!`;
  }

  function highlightWinning(line) {
    line.forEach(idx => {
      const cell = document.querySelector(`.cell[data-index='${idx}']`);
      if (cell) cell.classList.add('winning');
    });
  }

  function updateScore(winner) {
    if (winner === 'X') {
      score.X += 1;
      scoreXValue.textContent = score.X;
    } else if (winner === 'O') {
      score.O += 1;
      scoreOValue.textContent = score.O;
    } else {
      score.draw += 1;
      scoreDrawValue.textContent = score.draw;
    }
  }

  // ===== Minimax AI =====
  function checkWinnerOnBoard(b) {
    for (let combo of winningConditions) {
      const [a, bIdx, c] = combo;
      if (b[a] !== '' && b[a] === b[bIdx] && b[bIdx] === b[c]) {
        return b[a];
      }
    }
    if (!b.includes('')) return 'draw';
    return null;
  }

  function minimax(newBoard, depth, isMaximizing) {
    const result = checkWinnerOnBoard(newBoard);

    if (result !== null) {
      if (result === cpuMark) return 10 - depth;
      if (result === humanMark) return depth - 10;
      return 0;
    }

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === '') {
          newBoard[i] = cpuMark;
          best = Math.max(best, minimax(newBoard, depth + 1, false));
          newBoard[i] = '';
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === '') {
          newBoard[i] = humanMark;
          best = Math.min(best, minimax(newBoard, depth + 1, true));
          newBoard[i] = '';
        }
      }
      return best;
    }
  }

  function getBestMove() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = cpuMark;
        const scoreVal = minimax(board, 0, false);
        board[i] = '';
        if (scoreVal > bestScore) {
          bestScore = scoreVal;
          move = i;
        }
      }
    }
    return move;
  }

  function cpuMove() {
    if (!isGameActive) return;
    const idx = getBestMove();
    if (idx !== null) {
      playMove(idx, cpuMark);
    }
    if (isGameActive) {
      switchTurn();
    }
  }

  // ===== Init =====
  updateTurnIndicator();
});
