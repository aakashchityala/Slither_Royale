let nextDir = {x: 0, y: 0};
let food_dir = {x: 6, y: 7};
let score = 0;
let moveMusic = new Audio("move.mp3");
const foodMusic = new Audio("food.mp3");
const gameMusic = new Audio("music.mp3");
const overMusic = new Audio("gameover.mp3");
let scoreDisplay = document.querySelector(".currrentScore");
let highestScore = document.querySelector(".highestScore");
const grid = document.querySelector(".grid");
let previousTimeStamp = 0;
let speed = 19;
let currentDir = [{x: 11, y: 13}];
let hValue;

// Game loop function
function step(timeStamp) {
    window.requestAnimationFrame(step);
    if ((timeStamp - previousTimeStamp) / 1000 >= 1 / speed) {
        previousTimeStamp = timeStamp;
        game();
    }
}

// Collision detection function
function collide() {
    if (currentDir[0].x <= 0 || currentDir[0].x >= 18 || currentDir[0].y <= 0 || currentDir[0].y >= 18) {
        return true;
    }
    for (let i = 1; i < currentDir.length; i++) {
        if (currentDir[0].x === currentDir[i].x && currentDir[0].y === currentDir[i].y) {
            return true;  // Snake ran into itself
        }
    }
    return false;
}

// Randomize food location within grid boundaries
function randomFoodLocation() {
    food_dir.x = Math.floor(1 + Math.random() * 17); 
    food_dir.y = Math.floor(1 + Math.random() * 17);
}

// Game logic function
function game() {
    if (collide()) {
        overMusic.play();
        alert("Game Over");
        gameMusic.pause();
        currentDir = [{x: 11, y: 13}];
        score = 0;
        scoreDisplay.innerHTML = `Score: 0`;
        randomFoodLocation();
        nextDir = {x: 0, y: 0};
        gameMusic.play();
        return;
    }

    if (currentDir[0].x === food_dir.x && currentDir[0].y === food_dir.y) {
        score++;
        if (score > hValue) {
            hValue = score;
            localStorage.setItem("hScore", hValue);
            highestScore.innerHTML = `Highest Score: ${hValue}`;
        }
        scoreDisplay.innerHTML = `Score: ${score}`;
        foodMusic.play();
        currentDir.unshift({x: currentDir[0].x + nextDir.x, y: currentDir[0].y + nextDir.y});
        randomFoodLocation();  
    }

    // placing the previous snake body in place of the front one
    for (let i = currentDir.length - 2; i >= 0; i--) {
        currentDir[i + 1] = {...currentDir[i]};
    }

    grid.innerHTML = "";
    currentDir[0].x += nextDir.x;
    currentDir[0].y += nextDir.y;

    currentDir.forEach((element, index) => {
        let snakeEl = document.createElement("div");
        snakeEl.style.gridColumnStart = element.x;
        snakeEl.style.gridRowStart = element.y;
        if (index === 0) snakeEl.classList.add("head");
        else snakeEl.classList.add("tail");
        grid.appendChild(snakeEl);
    });

    let foodEl = document.createElement('div');
    foodEl.classList.add('food');
    foodEl.style.gridRowStart = food_dir.y;
    foodEl.style.gridColumnStart = food_dir.x;
    
    grid.appendChild(foodEl);
}

gameMusic.play();   

// Get the highest score from localStorage
let hScore = localStorage.getItem("hScore");
if (hScore === null) {
    hValue = 0;
    localStorage.setItem("hScore", hValue);
} else {
    hValue = parseInt(hScore);
    highestScore.innerHTML = `Highest Score: ${hValue}`;
}

window.requestAnimationFrame(step);

window.addEventListener("keydown", (event) => {
    moveMusic.play();
    switch (event.keyCode) {
        case 37:
            nextDir = {x: -1, y: 0};
            break;
        case 38: 
            nextDir = {x: 0, y: -1};
            break;
        case 39:
            nextDir = {x: 1, y: 0};
            break;
        case 40:
            nextDir = {x: 0, y: 1};
            break;
        default: 
            break;
    }
})