import Snake from "./snake";
import Fruit from "./fruit";
import { config, xGridSize, yGridSize } from "./config";

let snakePlayerOne, snakePlayerTwo;
let controls;
let wasdControls, Wkey, Akey, Skey, Dkey;
let fruit;
let fruitsEaten = 0;

config.scene = {
    preload: preload,
    create: create,
    update: update,
}
let game = new Phaser.Game(config);

function preload ()
{
    this.load.image('map', 'assets/map.png');
    this.load.image('fruit', 'assets/apple.png');
}

function create () 
{
    let snake = [
        '.11111111.',
        '1111111111',
        '1111111111',
        '1111111111',
        '1111111111',
        '1111111111',
        '1111111111',
        '1111111111',
        '1111111111',
        '.11111111.'
    ];
    let snakeOne = snake.slice();
    let snakeTwo = snake.slice();

    //Modify the colors of the snakes here
    let snakeOneColor = 'D';
    let snakeTwoColor = '7';

    snake.forEach((line, index) => {
        //Replace the '1's in the pixelmap with the corresponding colors
        snakeOne[index] = line.replace(/1/g, snakeOneColor);
        snakeTwo[index] = line.replace(/1/g, snakeTwoColor);
    })
    this.textures.generate('snakeOne', { data: snakeOne, pixelWidth: 2});
    this.textures.generate('snakeTwo', { data: snakeTwo, pixelWidth: 2});

    snakePlayerOne = new Snake(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this, 'one');   
    snakePlayerTwo = new Snake(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this, 'two');
    fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
    controls = this.input.keyboard.createCursorKeys();  
    this.wasdControls = {
        Wkey : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        Akey : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        Skey : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        Dkey : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    }
}

function update (time) 
{
    if(controls.left.isDown) {
        snakePlayerOne.goLeft();
    } else if(controls.right.isDown) {
        snakePlayerOne.goRight();
    } else if(controls.up.isDown) {
        snakePlayerOne.goUp();
    } else if(controls.down.isDown) {
        snakePlayerOne.goDown();
    }

    if(this.wasdControls.Akey.isDown) {
        snakePlayerTwo.goLeft();
    } else if(this.wasdControls.Dkey.isDown) {
        snakePlayerTwo.goRight();
    } else if(this.wasdControls.Wkey.isDown) {
        snakePlayerTwo.goUp();
    } else if(this.wasdControls.Skey.isDown) {
        snakePlayerTwo.goDown();
    }

    snakePlayerOne.update(time);
    if(snakePlayerOne.isEatingFruit(fruit)) {
        snakePlayerOne.addBodyPart('one');
        fruit.destroy();
        fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
    }

    snakePlayerTwo.update(time);    
    if(snakePlayerTwo.isEatingFruit(fruit)) {
        snakePlayerTwo.addBodyPart('two');
        fruit.destroy();
        fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
    }
}
