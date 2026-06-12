const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');

// Game Constants
const TILE_SIZE = 20;
const PACMAN_SPEED = 0.09   ; // Tiles per frame
const GHOST_SPEED = 0.05 ;

// 0: Empty, 1: Wall, 2: Dot
// 19 Columns x 21 Rows
const mapLayout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
    [1,1,1,1,2,1,0,1,1,0,1,1,0,1,2,1,1,1,1],
    [0,2,2,2,2,0,0,1,0,0,0,1,0,0,2,2,2,2,0], // Tunnel Row
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
    [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,2,1],
    [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
    [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// State
let tiles = [];
let score = 0;
let highScore = localStorage.getItem('pacmanHighScore') || 0;
let isGameOver = true;
let animationId;
let mouthOpen = 0;
let mouthSpeed = 0.1;

highScoreEl.innerText = highScore;

// --- CLASSES ---

class GameEntity {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dir = {x: 0, y: 0};
        this.nextDir = {x: 0, y: 0};
        this.radius = TILE_SIZE * 0.4;
    }

    getTilePos() {
        return {
            x: Math.round(this.x),
            y: Math.round(this.y)
        };
    }

    // Check if we are perfectly centered on a tile
    isCentered() {
        return Math.abs(this.x - Math.round(this.x)) < 0.05 && 
               Math.abs(this.y - Math.round(this.y)) < 0.05;
    }

    canMove(dx, dy) {
        const x = Math.round(this.x + dx);
        const y = Math.round(this.y + dy);
        // Bounds check
        if (y < 0 || y >= tiles.length || x < 0 || x >= tiles[0].length) return false;
        return tiles[y][x] !== 1; // 1 is wall
    }

    move() {
        // Handle Tunneling
        if (this.x < 0) this.x = tiles[0].length - 1;
        if (this.x >= tiles[0].length) this.x = 0;

        // Try to turn if centered
        if (this.isCentered()) {
            if (this.nextDir.x !== 0 || this.nextDir.y !== 0) {
                if (this.canMove(this.nextDir.x, this.nextDir.y)) {
                    this.dir = this.nextDir;
                    this.nextDir = {x: 0, y: 0};
                }
            }
            
            // Stop if hitting wall
            if (!this.canMove(this.dir.x, this.dir.y)) {
                return; // Stop moving
            }
        }

        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
    }
}

class Pacman extends GameEntity {
    constructor(x, y) {
        super(x, y, PACMAN_SPEED);
        this.mouthAngle = 0.2;
    }

    draw() {
        const cx = (this.x * TILE_SIZE) + (TILE_SIZE / 2);
        const cy = (this.y * TILE_SIZE) + (TILE_SIZE / 2);
        
        // Calculate Rotation
        let rotation = 0;
        if (this.dir.x === -1) rotation = Math.PI;
        if (this.dir.y === -1) rotation = -Math.PI/2;
        if (this.dir.y === 1) rotation = Math.PI/2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        
        // Animate Mouth
        if (mouthOpen > 0.2 || mouthOpen < 0) mouthSpeed = -mouthSpeed;
        mouthOpen += mouthSpeed * 0.1;
        
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, mouthOpen, 2 * Math.PI - mouthOpen);
        ctx.lineTo(0, 0);
        ctx.fillStyle = "#FFFF00";
        ctx.fill();
        ctx.restore();
    }
}

class Ghost extends GameEntity {
    constructor(x, y, color) {
        super(x, y, GHOST_SPEED);
        this.color = color;
        this.dir = {x: 1, y: 0}; // Initial movement
    }

    draw() {
        const cx = (this.x * TILE_SIZE) + (TILE_SIZE / 2);
        const cy = (this.y * TILE_SIZE) + (TILE_SIZE / 2);
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(cx, cy - 2, this.radius, Math.PI, 0);
        ctx.lineTo(cx + this.radius, cy + this.radius);
        ctx.lineTo(cx - this.radius, cy + this.radius);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(cx - 4, cy - 4, 3, 0, Math.PI*2);
        ctx.arc(cx + 4, cy - 4, 3, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(cx - 3, cy - 4, 1.5, 0, Math.PI*2);
        ctx.arc(cx + 5, cy - 4, 1.5, 0, Math.PI*2);
        ctx.fill();
    }

    aiMove(target) {
        // Only make decisions when perfectly centered on a tile
        if (this.isCentered()) {
            const opts = [];
            
            // Directions: Up, Down, Left, Right
            const dirs = [{x:0, y:-1}, {x:0, y:1}, {x:-1, y:0}, {x:1, y:0}];
            
            dirs.forEach(d => {
                // Don't reverse direction immediately (basic Ghost rule)
                if (d.x === -this.dir.x && d.y === -this.dir.y) return;
                
                if (this.canMove(d.x, d.y)) {
                    opts.push(d);
                }
            });

            if (opts.length === 0) {
                // Dead end (shouldn't happen often in this map), reverse
                this.dir = {x: -this.dir.x, y: -this.dir.y};
            } else {
                // Choose option that minimizes distance to Pacman (Simple Tracker)
                // Add randomness so they don't stack perfectly
                opts.sort((a, b) => {
                    const distA = Math.hypot((this.x + a.x) - target.x, (this.y + a.y) - target.y);
                    const distB = Math.hypot((this.x + b.x) - target.x, (this.y + b.y) - target.y);
                    return distA - distB + (Math.random() - 0.5); 
                });
                
                this.dir = opts[0];
            }
        }
        
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
        
        // Tunneling logic for ghosts too
        if (this.x < 0) this.x = tiles[0].length - 1;
        if (this.x >= tiles[0].length) this.x = 0;
    }
}

// --- INITIALIZATION ---

let pacman;
let ghosts = [];

function initGame() {
    // Deep copy map layout
    tiles = mapLayout.map(row => [...row]);
    score = 0;
    scoreEl.innerText = 0;
    
    // Setup Entities
    pacman = new Pacman(9, 15); // Start position
    ghosts = [
        new Ghost(9, 8, "#FF0000"), // Blinky (Red)
        new Ghost(8, 9, "#FFB8FF"), // Pinky (Pink)
        new Ghost(10, 9, "#00FFFF") // Inky (Cyan)
    ];
}

function drawMap() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < tiles.length; y++) {
        for (let x = 0; x < tiles[y].length; x++) {
            const tile = tiles[y][x];
            const posX = x * TILE_SIZE;
            const posY = y * TILE_SIZE;

            if (tile === 1) {
                // Wall
                ctx.fillStyle = "#1919A6";
                ctx.fillRect(posX + 2, posY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            } else if (tile === 2) {
                // Dot
                ctx.fillStyle = "#ffb8ae";
                ctx.beginPath();
                ctx.arc(posX + TILE_SIZE/2, posY + TILE_SIZE/2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function checkCollisions() {
    // 1. Dot Eating
    const pX = Math.round(pacman.x);
    const pY = Math.round(pacman.y);
    
    if (tiles[pY][pX] === 2) {
        tiles[pY][pX] = 0; // Remove dot
        score += 10;
        scoreEl.innerText = score;
        
        // Check Win Condition (No dots left)
        const dotsLeft = tiles.flat().includes(2);
        if (!dotsLeft) {
            gameOver(true);
        }
    }

    // 2. Ghost Collision
    for (let g of ghosts) {
        const dist = Math.hypot(pacman.x - g.x, pacman.y - g.y);
        if (dist < 0.8) { // Less than 1 tile distance
            gameOver(false);
        }
    }
}

function update() {
    if (isGameOver) return;

    // Clear Canvas
    drawMap();

    // Update Entities
    pacman.move();
    pacman.draw();

    ghosts.forEach(g => {
        g.aiMove(pacman);
        g.draw();
    });

    checkCollisions();

    animationId = requestAnimationFrame(update);
}

function gameOver(win) {
    isGameOver = true;
    cancelAnimationFrame(animationId);
    
    if (score > highScore) {
        highScore = score;
        highScoreEl.innerText = highScore;
        localStorage.setItem('pacmanHighScore', highScore);
    }

    overlayTitle.innerText = win ? "YOU WIN!" : "GAME OVER";
    overlayTitle.style.color = win ? "#00FF00" : "#FF0000";
    overlay.classList.remove('hidden');
}

function startGame() {
    initGame();
    isGameOver = false;
    overlay.classList.add('hidden');
    update();
}

// --- INPUT ---

document.addEventListener('keydown', e => {
    // Prevent default scrolling for arrows
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }

    if (isGameOver) {
        startGame();
        return;
    }

    switch(e.key) {
        case "ArrowUp": pacman.nextDir = {x: 0, y: -1}; break;
        case "ArrowDown": pacman.nextDir = {x: 0, y: 1}; break;
        case "ArrowLeft": pacman.nextDir = {x: -1, y: 0}; break;
        case "ArrowRight": pacman.nextDir = {x: 1, y: 0}; break;
    }
});

overlay.addEventListener('click', () => {
    if (isGameOver) startGame();
});

// Initial Render
initGame();
drawMap();
pacman.draw();
ghosts.forEach(g => g.draw());