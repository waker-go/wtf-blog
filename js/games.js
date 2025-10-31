// 游戏管理
let currentGame = null;

function openGame(gameType) {
    const modal = document.getElementById('game-modal');
    const container = document.getElementById('game-container');
    
    modal.classList.add('active');
    container.innerHTML = '';
    
    if (gameType === 'sakura-catch') {
        currentGame = new SakuraCatchGame(container);
    } else if (gameType === 'memory-match') {
        currentGame = new MemoryMatchGame(container);
    }
}

function closeGame() {
    const modal = document.getElementById('game-modal');
    modal.classList.remove('active');
    
    if (currentGame && currentGame.destroy) {
        currentGame.destroy();
    }
    currentGame = null;
}

// 游戏1: 樱花接球
class SakuraCatchGame {
    constructor(container) {
        this.container = container;
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.basketX = 250;
        this.petals = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.container.innerHTML = `
            <div class="sakura-catch-game">
                <h2>樱花接球</h2>
                <div class="game-info">
                    <div>得分: <span id="score">0</span></div>
                    <div>生命: <span id="lives">❤️❤️❤️</span></div>
                </div>
                <canvas id="catch-canvas" class="game-canvas" width="500" height="600"></canvas>
                <div class="game-controls">
                    <button class="btn btn-secondary" onclick="closeGame()">退出游戏</button>
                </div>
                <p style="margin-top: 15px; color: #666;">使用鼠标或触摸移动篮子接住樱花</p>
            </div>
        `;
        
        this.canvas = document.getElementById('catch-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 事件监听
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleMove(e));
        
        this.startGame();
    }
    
    handleMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        let x;
        
        if (e.type === 'touchmove') {
            x = e.touches[0].clientX - rect.left;
        } else {
            x = e.clientX - rect.left;
        }
        
        this.basketX = Math.max(40, Math.min(460, x));
    }
    
    startGame() {
        this.gameLoop();
        this.spawnPetal();
    }
    
    spawnPetal() {
        if (this.gameOver) return;
        
        this.petals.push({
            x: Math.random() * 450 + 25,
            y: -20,
            speed: 2 + Math.random() * 2,
            size: 15 + Math.random() * 10,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
        
        setTimeout(() => this.spawnPetal(), 1000 + Math.random() * 1000);
    }
    
    gameLoop() {
        if (this.gameOver) return;
        
        this.ctx.clearRect(0, 0, 500, 600);
        
        // 绘制篮子
        this.drawBasket();
        
        // 更新和绘制花瓣
        for (let i = this.petals.length - 1; i >= 0; i--) {
            const petal = this.petals[i];
            petal.y += petal.speed;
            petal.rotation += petal.rotationSpeed;
            
            this.drawPetal(petal);
            
            // 检测碰撞
            if (petal.y > 520 && petal.y < 560 &&
                petal.x > this.basketX - 40 && petal.x < this.basketX + 40) {
                this.score += 10;
                document.getElementById('score').textContent = this.score;
                this.petals.splice(i, 1);
            }
            // 花瓣掉出屏幕
            else if (petal.y > 600) {
                this.lives--;
                this.updateLives();
                this.petals.splice(i, 1);
                
                if (this.lives <= 0) {
                    this.endGame();
                }
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    drawBasket() {
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(this.basketX - 40, 540, 80, 10);
        this.ctx.fillRect(this.basketX - 45, 550, 10, 30);
        this.ctx.fillRect(this.basketX + 35, 550, 10, 30);
        this.ctx.fillRect(this.basketX - 35, 580, 70, 5);
    }
    
    drawPetal(petal) {
        this.ctx.save();
        this.ctx.translate(petal.x, petal.y);
        this.ctx.rotate(petal.rotation);
        
        // 绘制5瓣樱花
        for (let i = 0; i < 5; i++) {
            this.ctx.save();
            this.ctx.rotate((i * Math.PI * 2) / 5);
            
            const gradient = this.ctx.createRadialGradient(0, -petal.size * 0.4, 0, 0, -petal.size * 0.4, petal.size * 0.6);
            gradient.addColorStop(0, 'rgba(255, 200, 220, 1)');
            gradient.addColorStop(0.7, 'rgba(255, 210, 230, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 220, 235, 0.3)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(0, -petal.size * 0.4, petal.size * 0.35, petal.size * 0.5, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        // 花心
        this.ctx.fillStyle = 'rgba(255, 230, 180, 0.9)';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, petal.size * 0.25, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    updateLives() {
        const hearts = '❤️'.repeat(this.lives);
        document.getElementById('lives').textContent = hearts || '💔';
    }
    
    endGame() {
        this.gameOver = true;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, 500, 600);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束!', 250, 250);
        
        this.ctx.font = '30px Arial';
        this.ctx.fillText(`最终得分: ${this.score}`, 250, 300);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText('关闭窗口重新开始', 250, 350);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 游戏2: 记忆翻牌
class MemoryMatchGame {
    constructor(container) {
        this.container = container;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.canFlip = true;
        
        this.emojis = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🏵️', '💐'];
        
        this.init();
    }
    
    init() {
        // 创建卡片对
        const cardPairs = [...this.emojis, ...this.emojis];
        this.cards = this.shuffle(cardPairs);
        
        this.container.innerHTML = `
            <div class="memory-game">
                <h2>记忆翻牌</h2>
                <div class="game-info">
                    <div>步数: <span id="moves">0</span></div>
                    <div>配对: <span id="pairs">0/8</span></div>
                </div>
                <div class="memory-grid" id="memory-grid"></div>
                <div class="game-controls">
                    <button class="btn btn-secondary" onclick="currentGame.reset()">重新开始</button>
                    <button class="btn btn-secondary" onclick="closeGame()">退出游戏</button>
                </div>
            </div>
        `;
        
        this.renderCards();
    }
    
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    renderCards() {
        const grid = document.getElementById('memory-grid');
        grid.innerHTML = '';
        
        this.cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.innerHTML = `
                <div class="card-back">?</div>
                <div class="card-front">${emoji}</div>
            `;
            
            card.addEventListener('click', () => this.flipCard(index));
            grid.appendChild(card);
        });
    }
    
    flipCard(index) {
        if (!this.canFlip) return;
        
        const card = document.querySelector(`[data-index="${index}"]`);
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
        
        card.classList.add('flipped');
        this.flippedCards.push({ index, emoji: this.cards[index], element: card });
        
        if (this.flippedCards.length === 2) {
            this.canFlip = false;
            this.moves++;
            document.getElementById('moves').textContent = this.moves;
            
            setTimeout(() => this.checkMatch(), 800);
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.emoji === card2.emoji) {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            this.matchedPairs++;
            document.getElementById('pairs').textContent = `${this.matchedPairs}/8`;
            
            if (this.matchedPairs === 8) {
                setTimeout(() => this.winGame(), 500);
            }
        } else {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
        }
        
        this.flippedCards = [];
        this.canFlip = true;
    }
    
    winGame() {
        alert(`🎉 恭喜你赢了！\n总共用了 ${this.moves} 步`);
    }
    
    reset() {
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.canFlip = true;
        this.cards = this.shuffle([...this.emojis, ...this.emojis]);
        this.renderCards();
        document.getElementById('moves').textContent = '0';
        document.getElementById('pairs').textContent = '0/8';
    }
    
    destroy() {
        // 清理
    }
}
