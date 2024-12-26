const images = [
    "https://via.placeholder.com/200x200.png?text=Image+1",
    "https://via.placeholder.com/200x200.png?text=Image+2",
    "https://via.placeholder.com/200x200.png?text=Image+3"
];
let displayedImage = null;
let score = 0;
let level = 1;
let timer = 0;
let intervalId;
const pieces = ['♖', '♗', '♘', '♙']; // Example chess pieces

function startGame() {
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageElement = document.getElementById('random-image');
    imageElement.src = images[randomIndex];
    imageElement.style.display = 'block'; // Ensure the image is shown
    displayedImage = images[randomIndex];

    setTimeout(() => {
        imageElement.style.display = 'none';
        displayBoard();
        placeRandomPieces(level);
    }, 5000); // Show image for 5 seconds

    // Start the timer to memorize the pieces
    setTimeout(startTimer, 5000); // Timer starts after pieces disappear
}

function startTimer() {
    timer = 30; // Set the timer duration to give you more time
    intervalId = setInterval(() => {
        if (timer > 0) {
            timer--;
            document.getElementById('time').textContent = timer;
        } else {
            clearInterval(intervalId);
            submitAnswer();
        }
    }, 1000);
}

function displayBoard() {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = ''; // Clear existing cells

    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i; // Assign a unique index to each cell
        boardContainer.appendChild(cell);
    }
}

function placeRandomPieces(level) {
    const numPieces = Math.min(level + 2, pieces.length); // Increase number of pieces with levels
    const cells = document.querySelectorAll('.cell');

    // Clear cells before placing new pieces
    cells.forEach(cell => cell.textContent = '');

    // Place random pieces in random cells
    for (let i = 0; i < numPieces; i++) {
        const randomCellIndex = Math.floor(Math.random() * cells.length);
        const randomPieceIndex = Math.floor(Math.random() * pieces.length);
        cells[randomCellIndex].textContent = pieces[randomPieceIndex];
    }

    // Display the pieces for 5 seconds before hiding them
    setTimeout(() => {
        cells.forEach(cell => cell.textContent = '');
        displayPieces();
    }, 5000); // Pieces displayed for 5 seconds
}

function displayPieces() {
    const piecesContainer = document.querySelector('.pieces-container');
    piecesContainer.innerHTML = ''; // Clear existing pieces

    pieces.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece';
        pieceElement.textContent = piece;
        pieceElement.draggable = true;
        pieceElement.ondragstart = dragStart;
        piecesContainer.appendChild(pieceElement);
    });

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.ondrop = drop;
        cell.ondragover = allowDrop;
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event) {
    event.dataTransfer.setData("text", event.target.textContent);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    if (event.target.className === 'cell' && !event.target.textContent) { // Ensure target is empty cell
        event.target.textContent = data;
    }
}

function submitAnswer() {
    clearInterval(intervalId);
    const correctAnswer = getCorrectAnswer(level); // Function to generate correct answer based on level
    let userAnswer = [];
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => userAnswer.push(cell.textContent || ''));

    if (JSON.stringify(userAnswer.slice(0, correctAnswer.length)) === JSON.stringify(correctAnswer)) {
        score += 10;
        level++;
    } else {
        score -= 5;
    }

    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('result').textContent = 'Your score: ' + score;

    if (level <= pieces.length) {
        startGame(); // Start the next level
    } else {
        alert("Congratulations! You've completed all levels!");
        resetGame();
    }
}

function getCorrectAnswer(level) {
    const correctAnswer = [];
    const numPieces = Math.min(level + 2, pieces.length);
    for (let i = 0; i < numPieces; i++) {
        correctAnswer.push(pieces[i]);
    }
    return correctAnswer;
}

function resetGame() {
    score = 0;
    level = 1;
    document.getElementById('random-image').style.display = 'block';
    document.getElementById('result').textContent = '';
    startGame();
}
