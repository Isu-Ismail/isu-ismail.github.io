const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const scoreEl = document.getElementById('scoreVal');
const highScoreEl = document.getElementById('highScoreVal');
const statusText = document.getElementById('statusText');

// Dimensions
canvas.width = 500;
canvas.height = 500;

// Config
const GRID_SIZE = 25; // Size of one grid square
const TILE_COUNT = canvas.width / GRID_SIZE; // 20x20 grid

// Game State
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let animationId;
let lastRenderTime = 0;
let snakeSpeed = 10; // Moves per second

highScoreEl.innerText = highScore;

// Snake & Food
let snake = [];
let velocity = { x: 0, y: 0 };
let food = { x: 5, y: 5 };

// Initialize Snake Center
function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 }
    ];
    velocity = { x: 0, y: -1 }; // Start moving UP
    score = 0;
    snakeSpeed = 10;
    scoreEl.innerText = score;
    placeFood();
}

function placeFood() {
    let validPosition = false;

    while (!validPosition) {
        // 1. Generate random coordinates
        food = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };

        // 2. Check if this position overlaps with ANY part of the snake
        let collisionFound = false;
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                collisionFound = true;
                break; // Stop checking, this position is bad
            }
        }

        // 3. If no collision, the position is valid, and we can exit the loop
        if (!collisionFound) {
            validPosition = true;
        }
    }
}

function update(currentTime) {
    if (!gameRunning) return;

    animationId = requestAnimationFrame(update);

    // Control Speed (Game Loop Throttling)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / snakeSpeed) return;
    
    lastRenderTime = currentTime;

    // 1. Move Snake
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // 2. Check Death (Walls or Self)
    if (
        head.x < 0 || head.x >= TILE_COUNT || 
        head.y < 0 || head.y >= TILE_COUNT ||
        checkSelfCollision(head)
    ) {
        gameOver();
        return;
    }

    snake.unshift(head); // Add new head

    // 3. Check Food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.innerText = score;
        
        // Speed up slightly every 5 points
        if(score % 5 === 0) snakeSpeed += 1;
        
        placeFood();
    } else {
        snake.pop(); // Remove tail
    }

    draw();
}

function checkSelfCollision(head) {
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    // 1. Clear Screen
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Food (Accent Color)
    ctx.fillStyle = "#4CAF50"; // Green from CSS var
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

    // 3. Draw Snake (System Grey)
    ctx.fillStyle = "#333333";
    snake.forEach((segment, index) => {
        // Make head slightly different
        if(index === 0) ctx.fillStyle = "#111111"; 
        else ctx.fillStyle = "#333333";

        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    });
}

function startGame() {
    if (gameRunning) return;
    
    resetGame();
    gameRunning = true;
    overlay.style.display = 'none';
    requestAnimationFrame(update);
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    
    if (score > highScore) {
        highScore = score;
        highScoreEl.innerText = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }

    statusText.innerText = "SYSTEM FAILURE";
    statusText.style.color = "#e74c3c"; // Red danger color
    overlay.style.display = 'flex';
}

// Controls
window.addEventListener('keydown', e => {
    // Start Game on any arrow key
    if (!gameRunning && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        startGame();
    }
    
    // Prevent scrolling
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    switch (e.code) {
        case "ArrowUp":
            if (velocity.y === 0) velocity = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (velocity.y === 0) velocity = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (velocity.x === 0) velocity = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (velocity.x === 0) velocity = { x: 1, y: 0 };
            break;
        case "Space": // Alternative start key
            if(!gameRunning) startGame();
            break;
    }
});

// Initial Draw
resetGame();
draw();