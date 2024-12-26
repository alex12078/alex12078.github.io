const images = ["image1.jpg", "image2.jpg", "image3.jpg"]; // Replace with your image URLs
let displayedImage = null;
let score = 0;
let level = 1;
let timer = 0;
let intervalId;

function startGame() {
    // Display a random image
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageElement = document.getElementById('random-image');
    imageElement.src = images[randomIndex];
    displayedImage = images[randomIndex];

    // Hide the image after a few seconds
    setTimeout(() => {
        imageElement.style.display = 'none';
        displayBoard();
        displayPieces();
        startTimer();
    }, 5000);
}

function startTimer() {
    timer = 10; // Set the timer duration
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

    // Add cells to the board
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

    // Add pieces to the container
    const pieces = ['♖', '♗', '♘', '♙']; // Example chess pieces
    pieces.forEach(piece => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'piece';
        pieceElement.textContent = piece;
        pieceElement.draggable = true;
        pieceElement.ondragstart = dragStart;
        piecesContainer.appendChild(pieceElement);
    });

    // Add drop targets to the board
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
    event.target.textContent = data;
}

function submitAnswer() {
    clearInterval(intervalId);
    // Check the user's answer and update the score
    // This is a placeholder, you need to implement the logic to check the user's answer
    const correctAnswer = ['♖', '♗', '♘', '♙']; // Example correct answer
    let userAnswer = [];
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => userAnswer.push(cell.textContent));

    if (JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)) {
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
    // Reset the game state
    document.getElementById('random-image').style.display = 'block';
    document.getElementById('result').textContent = '';
    startGame();
}
