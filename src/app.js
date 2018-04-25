import Snake from "./snake";
import Fruit from "./fruit";
import { config, xGridSize, yGridSize } from "./config";

let snake;
let controls;
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
    fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
    controls = this.input.keyboard.createCursorKeys();
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

    snake.update(time);
    if(snake.isEatingFruit(fruit)) {
        snake.addBodyPart();
        fruit.destroy();
        fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
    }
}