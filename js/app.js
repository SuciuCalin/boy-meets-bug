const canvasWidth = 909;    // The width of the canvas
const canvasHeight = 656;   // The height of the canvas

const enemySpeed = 50;                      // The speed of the enemy
const fasterEnemySpeed = 2 * enemySpeed;    // The speed of the FasterEnemy

const userXmove = 100;  // The user moves on the X axis by this value
const userYmove = 80;   // The user moves on the Y axis by this value

const playerStartX = 400;   // The player X start position
const playerStartY = 450;   // The player Y start position

// Image resources
let playerImg;
const keyImg = 'images/Key.png';
const bugImg = 'images/enemy-bug.png';
const rockImg = 'images/Rock.png';
const princessImg = 'images/char-princess-girl.png'
const characterBoyImg = 'images/char-boy.png';
const characterCatImg = 'images/char-cat-girl.png';
const characterHornImg = 'images/char-horn-girl.png';
const selectorImg = 'images/Selector.png';
const heartImg = 'images/Heart.png';
const scoreHeart = 'images/scoreHeart.png';
const scoreKey = 'images/scoreKey.png';

let level = 1;      // Keeps track of the current Level
let lives = 3;      // Keeps track of the player lives
let levelKey = 0;   // Keeps track if the key was collected
let levelHeart = 0;  // Keeps track if the heart was collected
let timer;          // Used for startTimer() and stopTimer()
let time = 0;       // Keeps track of the player time in seconds

/*
 *  Sprite class - the parent class for creating sprite objects
 *
 *  @constructor for a new Sprite takes 3 parameters:
 *      @param: sprite - the image resource for drawing the Sprite
 *      @param: x - the x coordinate for drawing the Sprite
 *      @param: y - the y coordinate for drawing the Sprite
 */
class Sprite {

    // Constructor for a new Sprite
    constructor(sprite, x, y) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
    }

    update() {}

    // Method for handling the Sprite movement with the keyboard controls
    handleInput() {}

    // Method for drawing the Sprite on the screen
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

}

/*
 * Enemies the player must avoid
 */
class Enemy extends Sprite {

    /*
     * Updates the enemy position
     * Parameter: dt - a time delta between ticks which will ensure the game runs at the same speed for all computers
     */
    update(dt) {
        this.x += (level * enemySpeed) * dt;

        // When the enemy moves off the screen, the X position will be reset
        if (this.x > canvasWidth) {
            this.x = randomX();
        }

    }
}

/*
 * Enemies the player must avoid
 */
class FasterEnemy extends Enemy {

    /*
     * Updates the enemy position
     * Parameter: dt - a time delta between ticks which will ensure the game runs at the same speed for all computers
     */
    update(dt) {
        this.x += (level * fasterEnemySpeed) * dt;

        // When the enemy moves off the screen, the X and Y positions will be reset
        if (this.x > canvasWidth) {
            this.x = randomX();
            this.y = randomY();
        }

    }
}

/*
 * Player class
 */
class Player extends Sprite {

    // Method for handling the Player movement with the keyboard controls
    handleInput(controls) {
        // Movement controls
        switch (controls) {
            case 'up':
                this.y -= userYmove;
                break;
            case 'down':
                this.y += userYmove;
                break;
            case 'right':
                this.x += userXmove;
                break;
            case 'left':
                this.x -= userXmove;
                break;
        }

        // Confine players movement to the canvasWidth and canvasHeight
        if (this.x > canvasWidth - 109) {
            this.x = canvasWidth - 109;
        } else if (this.x < 0) {
            this.x = 0;
        } else if (this.y > canvasHeight - 206) {
            this.y = canvasHeight - 206;
        } else if (this.y < -50) {
            this.y = -30;
        }
    }

    render() {
        ctx.drawImage(Resources.get(playerImg), this.x, this.y);
    }
}

/*
 * CharSelector class - for selecting a character
 */
class CharSelector extends Sprite {

    // Method for handling the character selection with the keyboard controls
    handleInput(controls) {
        // Movement controls
        switch (controls) {
            case 'right':
                this.x += userXmove;
                break;
            case 'left':
                this.x -= userXmove;
                break;
            case 'enter':
                switch (this.x) {
                    case 300:
                        playerImg = characterBoyImg;
                        break;
                    case 400:
                        playerImg = characterCatImg;
                        break;
                    case 500:
                        playerImg = characterHornImg;
                        break;
                    default:
                        playerImg = characterBoyImg;
                        break;
                }
                startTimer();
                break;
        }

        // Confine character selector movement
        if (this.x > 500) {
            this.x = 500;
        } else if (this.x < 300) {
            this.x = 300;
        }

    }
}

/*
 * Function for drawing the score on the canvas
 */
function renderScore() {
    ctx.font = '20px Time New Roman';

    // Draws the level information
    ctx.fillText("Level: " + level, 10, 30);

    // Draws the time information
    ctx.fillText(time + " seconds", canvasWidth / 2 - 30, 30);

    // Draws the collected key information
    ctx.drawImage(Resources.get(scoreKey), 780, 5);
    ctx.fillText('x ' + levelKey, 810, 30);

    // Draws the hearts (player lives) information
    ctx.drawImage(Resources.get(scoreHeart), 850, 5);
    ctx.fillText('x ' + lives, 880, 30);

}

/*
 *  Starts the timer
 */
 function startTimer() {
    let start = new Date;

    timer = setInterval(function() {
        time = Math.round((new Date - start) / 1000, 0);
    }, 1000);

 }

/*
 *  Stops the timer
 */
function stopTimer() {
    clearInterval(timer);
    time = 0;
}

/*
 * Checks if the player has lost all the lives (game over)
 */
function checkLives() {
    if (lives <= 0) {
        swal("Game Over!", "You reached Level " + level + " in " + time + " seconds!", "error");
        stopTimer();
        newGame();
    } else {
        swal("Whatch out! Lives don't grow on trees, you know." ,"You get one heart every 5 levels.", "warning");
    }
}

/*
 * Returns a random -X location
 */
function randomX() {
    let xLocation = [0, 100, 200, 300, 400, 500, 600, 700, 800];
    return xLocation[Math.floor(Math.random() * xLocation.length)] * -1;
}

/*
 * Returns a random Y location
 */
function randomY() {
    let yLocation = [60, 130, 210, 290, 370];
    return yLocation[Math.floor(Math.random() * yLocation.length)];
}

/*
 * Updates variables for a new game
 */
function newGame() {
    level = 1;
    lives = 3;
    levelKey = 0;
    levelHeart = 0;
    time = 0;
    startTimer();
}

// Instantiating objects

// Array with the enemy objects
const allEnemies = [
    new Enemy(bugImg, randomX(), 60),
    new Enemy(bugImg, randomX(), 130),
    new Enemy(bugImg, randomX(), 210),
    new Enemy(bugImg, randomX(), 290),
    new Enemy(bugImg, randomX(), 370),
    new FasterEnemy(rockImg, randomX(), randomY()),
    new FasterEnemy(rockImg, randomX(), randomY())
];

const player = new Player(playerImg, playerStartX, playerStartY);   // Player object
const selector = new CharSelector(selectorImg, 400, 210);           // CharSelector object
const keyItem = new Sprite(keyImg, -1 * randomX(), randomY());      // Key object
const heartItem = new Sprite(heartImg, -1 * randomX(), randomY());  // Heart object

// This listens for key presses and sends the keys to your
// Player.handleInput() and selector.handleInput() methods.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (playerImg != null) {
        player.handleInput(allowedKeys[e.keyCode]);
    } else {
        selector.handleInput(allowedKeys[e.keyCode]);
    }

    /*
     * Keyboard shortcut 'n'
     * to reload the page (start a new game from the character selection screen)
     */
    if (e.keyCode == 78) {
        location.reload();
    }

});
