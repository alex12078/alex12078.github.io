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

function startGame() {
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageElement = document.getElementById('random-image');
    imageElement.src = images[randomIndex];
    imageElement.style.display = 'block'; // Ensure the image is shown
    displayedImage = images[randomIndex];

    setTimeout(() => {
        imageElement.style.display = 'none';
        displayBoard();
        displayPieces();
        startTimer();
    }, 5000);
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

function displayPieces() {
    const piecesContainer = document.querySelector('.pieces-container');
    piecesContainer.innerHTML = ''; // Clear existing pieces

    const pieces = ['♖', '♗', '♘', '♙']; // Example chess pieces
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
    const correctAnswer = ['♖', '♗', '♘', '♙']; // Example correct answer
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
}

function resetGame() {
    document.getElementById('random-image').style.display = 'block';
    document.getElementById('result').textContent = '';
    startGame();
}
