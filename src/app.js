import Snake from "./snake";
import Fruit from "./fruit";
import { config, xGridSize, yGridSize } from "./config";

let snakes = [];
let controls;
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
    let params = getParams(location.search);
    let snakeBitmap = [
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
    
    let snakeBitmaps = [];
    if(params.players > 1 && params.players < 5) {
        for(let i = 0; i < params.players; i++) {
            snakeBitmaps[i] = snakeBitmap.slice();
        }
    } else {
        snakeBitmaps[0] = snakeBitmap.slice();
    }
    //initialize with some default colors for the snakes
    let snakeColors = ['D', '7', 'A', '3'];
    if(params.colors !== undefined) {
        let colors = params.colors.split(',');
        //Override snake colors with parameter colors
        colors.forEach((color, index) => {
            snakeColors[index] = color;
        })
    }

    snakeBitmap.forEach((line, index) => {
        //Replace the '1's in the pixelmap with the corresponding colors
        for(let i = 0; i < snakeBitmaps.length; i++) {
            snakeBitmaps[i][index] = line.replace(/1/g, snakeColors[i]);
        }
    });

    for(let i = 0; i < snakeBitmaps.length; i++) {
        this.textures.generate(`snake${i}`, { data: snakeBitmaps[i], pixelWidth: 2});
        snakes[i] = new Snake(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this, i);
    }

    this.fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
    let keyboardControls = this.input.keyboard.createCursorKeys();  
    let wasdControls = {
        up : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        left : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        down : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        right : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    let tfghControls = {
        up : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T),
        left : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
        down : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G),
        right : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H)
    };
    let ijklControls = {
        up : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
        left : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        down : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
        right : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
    };
    this.controls = [keyboardControls, wasdControls, tfghControls, ijklControls];
}

function update (time) 
{
    let self = this;
    this.controls.forEach((controller, index) => {
        if(controller.left.isDown) {
            if(snakes[index]) {
                snakes[index].goLeft();
            }
        } else if(controller.right.isDown) {
            if(snakes[index]) {
                snakes[index].goRight();
            }
        } else if(controller.up.isDown) {
            if(snakes[index]) {
                snakes[index].goUp();
            }
        } else if(controller.down.isDown) {
            if(snakes[index]) {
                snakes[index].goDown();
            }
        }
    });

    snakes.forEach((snake, index) => {
        snake.update(time);
        if(snake.isEatingFruit(self.fruit)) {
            snake.addBodyPart();
            self.fruit.destroy();
            self.fruit = new Fruit(Phaser.Math.Between(0, xGridSize - 1), Phaser.Math.Between(0, yGridSize - 1), this);
        }
    });
}

//Get parameters from query string
function getParams(query) {
    if (!query) {
      return { };
    }
  
    return (/^[?#]/.test(query) ? query.slice(1) : query)
      .split('&')
      .reduce((params, param) => {
        let [ key, value ] = param.split('=');
        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
        return params;
      }, { });
  };