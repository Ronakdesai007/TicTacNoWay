const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');
const modeButton = document.getElementById('modeButton');

let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Player starts with "X"
let gameActive = true;
let isSinglePlayer = true; // Track game mode

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

modeButton.addEventListener('click', toggleGameMode);
restartButton.addEventListener('click', restartGame);

function toggleGameMode() {
    isSinglePlayer = !isSinglePlayer;
    modeButton.innerText = isSinglePlayer ? 'Single Player' : 'Two Player';
    restartGame(); // Restart game on mode switch
}

function handleCellClick(clickedCell, clickedCellIndex) {
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return; // Prevent clicking if cell is occupied or game is over
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();

    if (isSinglePlayer && gameActive) {
        setTimeout(() => computerPlay(), 500); // Delay for computer move
    }
}

function computerPlay() {
    const availableCells = gameState.map((cell, index) => (cell === "") ? index : null).filter(index => index !== null);
    
    // Choose a move using the best move logic
    let move = findBestMove();
    if (move === null) {
        move = availableCells[Math.floor(Math.random() * availableCells.length)];
    }
    
    const clickedCell = board.children[move];
    updateCell(clickedCell, move);
    checkResult();
}

function findBestMove() {
    // Check for winning move
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === "O" && gameState[b] === "O" && gameState[c] === "") return c;
        if (gameState[b] === "O" && gameState[c] === "O" && gameState[a] === "") return a;
        if (gameState[a] === "O" && gameState[c] === "O" && gameState[b] === "") return b;
    }

    // Block opponent's winning move
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === "X" && gameState[b] === "X" && gameState[c] === "") return c;
        if (gameState[b] === "X" && gameState[c] === "X" && gameState[a] === "") return a;
        if (gameState[a] === "X" && gameState[c] === "X" && gameState[b] === "") return b;
    }

    return null; // No immediate winning move
}

function updateCell(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    // Add the pop-up effect
    clickedCell.classList.add('active');
    setTimeout(() => {
        clickedCell.classList.remove('active');
    }, 200); // Duration of the effect
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `Player ${currentPlayer} wins!`;
        gameActive = false; // End the game
        return;
    }

    if (!gameState.includes("")) {
        statusDisplay.innerHTML = "It's a draw!";
        gameActive = false; // End the game
        return;
    }

    // Toggle to the next player
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;
}

function restartGame() {
    gameActive = true;
    currentPlayer = "X"; // Reset to Player X's turn
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = "Player X's turn";
    Array.from(board.children).forEach(cell => cell.innerHTML = "");
}

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-cell-index', i);
        cell.addEventListener('click', () => handleCellClick(cell, i));
        board.appendChild(cell);
    }
}

createBoard();
