const canvas = document.getElementById('runnerCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gameOverlay');
const scoreEl = document.getElementById('scoreVal');
const highScoreEl = document.getElementById('highScoreVal');
const statusText = document.getElementById('statusText');

// Dimensions (SQUARE for Circle)
canvas.width = 450;
canvas.height = 450;

// Game State
let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let animationId;
let frame = 0;
let gameSpeed = 5;

// Constants
// Lowered Ground Y to fit better in a circle
const GROUND_Y = canvas.height / 1.7;
const GRAVITY = 0.3;
const JUMP_POWER = -9;

highScoreEl.innerText = highScore;

// Player (Dark Grey)
const dino = {
    x: 80, // Moved slightly right
    y: GROUND_Y - 30,
    w: 30,
    h: 30,
    dy: 0,
    grounded: false,
    color: '#333333' 
};

// Obstacles
let obstacles = [];

function spawnObstacle() {
    const h = Math.random() * (50 - 20) + 20;
    obstacles.push({
        x: canvas.width,
        y: GROUND_Y - h,
        w: 20,
        h: h,
        passed: false
    });
}

function draw() {
    // 1. Clear
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Ground Line
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Draw Dino
    ctx.fillStyle = dino.color;
    ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
    
    // Eye
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(dino.x + 20, dino.y + 6, 4, 4);

    // 4. Obstacles
    ctx.fillStyle = "#999999"; 
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    });
}

function update() {
    if (!gameRunning) return;

    animationId = requestAnimationFrame(update);
    frame++;

    gameSpeed = 5 + (score * 0.05);

    // Physics
    dino.dy += GRAVITY;
    dino.y += dino.dy;

    if (dino.y + dino.h > GROUND_Y) {
        dino.y = GROUND_Y - dino.h;
        dino.dy = 0;
        dino.grounded = true;
    } else {
        dino.grounded = false;
    }

    // Spawning
    let spawnRate = Math.floor(100 - (gameSpeed * 1.5));
    if (spawnRate < 40) spawnRate = 40;

    if (frame % spawnRate === 0) {
        spawnObstacle();
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        if (
            dino.x < obs.x + obs.w &&
            dino.x + dino.w > obs.x &&
            dino.y < obs.y + obs.h &&
            dino.y + dino.h > obs.y
        ) {
            gameOver();
        }

        if (obs.x + obs.w < 0) {
            obstacles.splice(i, 1);
            score++;
            scoreEl.innerText = score;
            i--;
        }
    }

    draw();
}

function jump() {
    if (dino.grounded) {
        dino.dy = JUMP_POWER;
        dino.grounded = false;
    }
}

function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    score = 0;
    scoreEl.innerText = 0;
    obstacles = [];
    dino.y = GROUND_Y - 30;
    dino.dy = 0;
    frame = 0;
    gameSpeed = 5;
    
    overlay.style.display = 'none';
    update();
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    
    if (score > highScore) {
        highScore = score;
        highScoreEl.innerText = highScore;
        localStorage.setItem('dinoHighScore', highScore);
    }

    statusText.innerText = "SYSTEM CRASHED";
    statusText.style.color = "#ff5f56";
    overlay.style.display = 'flex';
}

window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameRunning) startGame();
        else jump();
    }
});

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (!gameRunning) startGame();
    else jump();
});

draw();