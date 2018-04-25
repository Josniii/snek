import Snake from "./snake";
import Fruit from "./fruit";
import { config, xGridSize, yGridSize } from "./config";

let snake;
let snake_;
let controls;
let Wkey, Akey, Skey, Dkey;
let fruit;
let fruitsEaten = 0;

config.scene = {
    preload: preload,
    create: create,
    update: update,
}
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('map', 'assets/map.png');
    this.load.image('snake', 'assets/snake.png');
    this.load.image('fruit', 'assets/apple.png');
}

function create () 
{
    snake = new Snake(8, 8, this);   
    snake_ = new Snake(20, 20, this);
    fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
    controls = this.input.keyboard.createCursorKeys();  
    Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

function update (time) 
{
    if(controls.left.isDown) {
        snake.goLeft();
    } else if(controls.right.isDown) {
        snake.goRight();
    } else if(controls.up.isDown) {
        snake.goUp();
    } else if(controls.down.isDown) {
        snake.goDown();
    }

    if(Akey.isDown) {
        snake_.goLeft();
    } else if(Dkey.isDown) {
        snake_.goRight();
    } else if(Wkey.isDown) {
        snake_.goUp();
    } else if(Skey.isDown) {
        snake_.goDown();
    }

    

    snake.update(time);
    snake_.update(time);
    if(snake.isEatingFruit(fruit)) {
        snake.addBodyPart();
        fruit.destroy();
        fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
    }    
    if(snake_.isEatingFruit(fruit)) {
        snake_.addBodyPart();
        fruit.destroy();
        fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
    }
}