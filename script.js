document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('.cell');
  const messageEl = document.getElementById('message');
  const resetBtn = document.getElementById('resetBtn');
  const modeRadios = document.getElementsByName('mode');

  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDrawEl = document.getElementById('scoreDraw');

  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let isGameActive = true;
  let mode = 'friend';  // 'friend' or 'computer'

  let score = { X: 0, O: 0, draw: 0 };

  const winningConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  function getSelectedMode() {
    for (let r of modeRadios) {
      if (r.checked) {
        return r.value;
      }
    }
    return 'friend';
  }

  function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (board[index] !== '' || !isGameActive) return;

    makeMove(index, currentPlayer);
    cell.textContent = currentPlayer;

    checkResult();

    if (isGameActive && mode === 'computer' && currentPlayer === 'X') {
      // computer's turn (O)
      currentPlayer = 'O';
      messageEl.textContent = `Computer's turn (O)`;
      setTimeout(() => {
        const aiIdx = getBestMove();
        if (aiIdx !== null) {
          makeMove(aiIdx, 'O');
          const aiCell = document.querySelector(`.cell[data-index='${aiIdx}']`);
          aiCell.textContent = 'O';
          checkResult();
        }
        if (isGameActive) {
          currentPlayer = 'X';
          messageEl.textContent = `Player ${currentPlayer}'s turn`;
        }
      }, 500);
    } else if (isGameActive) {
      // friend mode or after computer move
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      messageEl.textContent = `Player ${currentPlayer}'s turn`;
    }
  }

  function getRandomEmptyCell() {
    const emptyIndices = board
      .map((val, idx) => val === '' ? idx : null)
      .filter(i => i !== null);
    if (emptyIndices.length === 0) return null;
    const rand = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    return rand;
  }

  function makeMove(index, player) {
    board[index] = player;
  }

  function highlightWinning(line) {
    line.forEach(idx => {
      const cell = document.querySelector(`.cell[data-index='${idx}']`);
      if (cell) cell.classList.add('winning');
    });
  }

  function checkResult() {
    let roundWon = false;
    let winLine = null;

    for (let combo of winningConditions) {
      const [a, b, c] = combo;
      if (
        board[a] !== '' &&
        board[a] === board[b] &&
        board[b] === board[c]
      ) {
        roundWon = true;
        winLine = combo;
        break;
      }
    }

    if (roundWon) {
      highlightWinning(winLine);
      messageEl.textContent = `Player ${currentPlayer} wins!`;
      isGameActive = false;
      updateScore(currentPlayer);
      return;
    }

    if (!board.includes('')) {
      messageEl.textContent = "It's a draw!";
      isGameActive = false;
      updateScore('draw');
      return;
    }
  }

  function updateScore(winner) {
    if (winner === 'X') {
      score.X += 1;
      scoreXEl.textContent = `X wins: ${score.X}`;
    } else if (winner === 'O') {
      score.O += 1;
      scoreOEl.textContent = `O wins: ${score.O}`;
    } else if (winner === 'draw') {
      score.draw += 1;
      scoreDrawEl.textContent = `Draws: ${score.draw}`;
    }
  }

  function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = 'X';
    messageEl.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(c => {
      c.textContent = '';
      c.classList.remove('winning');
    });
    mode = getSelectedMode();
  }

  // Event listeners
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetBtn.addEventListener('click', resetGame);
  modeRadios.forEach(r => {
    r.addEventListener('change', () => {
      resetGame();
    });
  });

  // Init
  mode = getSelectedMode();
  messageEl.textContent = `Player ${currentPlayer}'s turn`;
});
