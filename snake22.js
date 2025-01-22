document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const speedElement = document.getElementById('speed');
    const messageElement = document.getElementById('message');
    const exitButton = document.getElementById('exitButton');
    const exitScreen = document.getElementById('exitScreen');
    const restartButton = document.getElementById('restartButton');
    const speedUpButton = document.getElementById('speedUpButton');
    const speedDownButton = document.getElementById('speedDownButton');

    const gridSize = 20;
    let gameSpeed = 100; // 초기 게임 속도 (밀리초)
    let speedLevel = 1;
    let snake, food, dx, dy, score, gameOver, highScore = 0;
    let gameLoop;

    function initGame() {
        snake = [{x: 10, y: 10}];
        food = {x: 15, y: 15};
        dx = 1;
        dy = 0;
        score = 0;
        gameOver = false;
        updateScore();
        updateSpeed();
        hideMessage();
        exitScreen.style.display = 'none';
    }

    function updateScore() {
        scoreElement.textContent = `점수: ${score}`;
        if (score > highScore) {
            const oldHighScore = highScore;
            highScore = score;
            highScoreElement.textContent = `최고 점수: ${highScore}`;
            if (oldHighScore > 0) {
                showMessage("새로운 최고 기록!");
            }
        }
    }

    function updateSpeed() {
        speedElement.textContent = `속도: ${speedLevel}`;
    }

    function showMessage(text) {
        messageElement.textContent = text;
        messageElement.style.display = 'block';
        messageElement.style.position = 'fixed';
        messageElement.style.color = 'white';
        messageElement.style.fontSize = '30px';
        messageElement.style.top = '20px';  // 하단에서 20px
        messageElement.style.right = '20px';   // 오른쪽에서 20px
        
        setTimeout(hideMessage, 2000);
    }

    function hideMessage() {
        messageElement.style.display = 'none';
    }

    function drawSnake() {
        snake.forEach((segment, index) => {
            if (index === 0) {
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = 'blue'
            }
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);

            if (index === 0) {
                ctx.fillStyle = 'white';
                const eyeSize = gridSize / 4;
                ctx.fillRect((segment.x * gridSize) + eyeSize, (segment.y * gridSize) + eyeSize, eyeSize, eyeSize);
                ctx.fillRect((segment.x * gridSize) + gridSize - 2*eyeSize, (segment.y * gridSize) + eyeSize, eyeSize, eyeSize);
            }
        });
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};

        if (head.x < 0 || head.x >= canvas.width / gridSize || 
            head.y < 0 || head.y >= canvas.height / gridSize) {
            gameOver = true;
            return;
        }

        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver = true;
                return;
            }
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            generateFood();
            score += 10;
            updateScore();
        } else {
            snake.pop();
        }
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * (canvas.width / gridSize));
        food.y = Math.floor(Math.random() * (canvas.height / gridSize));
    }

    function runGameLoop() {
        if (gameOver) {
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.fillText('게임 오버!', canvas.width / 2 - 70, canvas.height / 2);
            ctx.font = '20px Arial';
            ctx.fillText('E 또는 R키를 눌러 재시작', canvas.width / 2 - 120, canvas.height / 2 + 40);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        moveSnake();
        drawSnake();
        drawFood();
        gameLoop = setTimeout(runGameLoop, gameSpeed);
    }

    document.addEventListener('keydown', (e) => {
        if (gameOver && (e.key === 'e' || e.key === 'E' || e.key === 'r' || e.key === 'R')) {
            initGame();
            runGameLoop();
            return;
        }

        switch(e.key) {
            case 'ArrowUp': if (dy !== 1) { dx = 0; dy = -1; } break;
            case 'ArrowDown': if (dy !== -1) { dx = 0; dy = 1; } break;
            case 'ArrowLeft': if (dx !== 1) { dx = -1; dy = 0; } break;
            case 'ArrowRight': if (dx !== -1) { dx = 1; dy = 0; } break;
        }
    });

    exitButton.addEventListener('click', () => {
        clearTimeout(gameLoop);
        exitScreen.style.display = 'flex';
    });

    restartButton.addEventListener('click', () => {
        initGame();
        runGameLoop();
    });

    speedUpButton.addEventListener('click', () => {
        if (speedLevel < 10) {
            speedLevel++;
            gameSpeed = 100 - (speedLevel - 1) * 10;
            updateSpeed();
            showMessage(`속도가 증가했습니다: ${speedLevel}`);
        }
    });

    speedDownButton.addEventListener('click', () => {
        if (speedLevel > 1) {
            speedLevel--;
            gameSpeed = 100 - (speedLevel - 1) * 10;
            updateSpeed();
            showMessage(`속도가 감소했습니다: ${speedLevel}`);
        }
    });

    initGame();
    runGameLoop();
});
