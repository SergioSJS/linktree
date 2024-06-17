const canvas = document.getElementById('diceCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const diceImages = [];
const numDice = 6;
const diceSize = 50;
const imagePaths = [
    'assets/dices/d4.png',
    'assets/dices/d6.png',
    'assets/dices/d8.png',
    'assets/dices/d10.png',
    'assets/dices/d12.png',
    'assets/dices/d20.png'
];

let imagesLoaded = 0;

// Function to load images
function loadImages(paths, callback) {
    paths.forEach((path, index) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === paths.length) {
                callback();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
        };
        diceImages[index] = img;
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

class Dice {
    constructor() {
        this.respawn();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.angularVelocity;

        if (this.x < 0 || this.x + diceSize > canvas.width) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y + diceSize > canvas.height) {
            this.vy *= -1;
        }

        const elapsedTime = Date.now() - this.spawnTime;
        if (elapsedTime > this.life) {
            this.opacity -= 0.05;
        }
        if (this.opacity <= 0) {
            this.respawn();
        }
    }

    draw() {
        if (this.image && this.image.complete) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x + diceSize / 2, this.y + diceSize / 2);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image, -diceSize / 2, -diceSize / 2, diceSize, diceSize);
            ctx.restore();
        }
    }

    respawn() {
        this.image = diceImages[getRandomInt(0, diceImages.length - 1)];
        this.x = getRandomInt(0, canvas.width - diceSize);
        this.y = getRandomInt(0, canvas.height - diceSize);
        this.vx = getRandomFloat(-4, 4);
        this.vy = getRandomFloat(-4, 4);
        this.angle = 0;
        this.angularVelocity = getRandomFloat(-0.1, 0.1);
        this.opacity = 1;
        this.life = 10000; // Time in milliseconds
        this.spawnTime = Date.now();
    }
}

const diceArray = [];
for (let i = 0; i < numDice; i++) {
    diceArray.push(new Dice());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    diceArray.forEach(dice => {
        dice.update();
        dice.draw();
    });
    requestAnimationFrame(animate);
}

loadImages(imagePaths, () => {
    animate();
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
