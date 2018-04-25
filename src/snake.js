import directions from "./directions";
import { xGridSize, yGridSize, gridScaling, config } from './config';

export default Phaser.Class({

    initialize:

    function Snake(x, y, scene) {

        this.xMax = xGridSize;
        this.yMax = yGridSize;

        //Setting up the body and the head.
        this.body = scene.add.group();
        this.head = this.body.create(x * gridScaling, y * gridScaling, 'snake');
        this.head.setOrigin(0);
        this.headPos = new Phaser.Geom.Point(x, y);
        this.tailPos = new Phaser.Geom.Point(x, y);

        //Setting up attributes that control the speed and direction of the snake
        this.minTimeBetweenMoves = 0;
        this.timeBetweenMoves = 100;
        this.timeToNextMove = 1000;
        this.fruitsBetweenSpeedIncrease = 5;
        this.direction = directions.RIGHT;
        this.hasChangedDirection = false;

        this.bodyPartsAdded = 0;
        this.alive = true;
    },

    update: function(time) {
        if(time >= this.timeToNextMove) {
            this.move(time);
        }
    },

    move: function(time) {
        switch(this.direction) {
            case (directions.LEFT):
                this.headPos.x = Phaser.Math.Wrap(this.headPos.x - 1, 0, this.xMax);
                break;
            case (directions.RIGHT):
                this.headPos.x = Phaser.Math.Wrap(this.headPos.x + 1, 0, this.xMax);
                break;
            case (directions.UP):
                this.headPos.y = Phaser.Math.Wrap(this.headPos.y - 1, 0, this.yMax);
                break;
            case (directions.DOWN):
                this.headPos.y = Phaser.Math.Wrap(this.headPos.y + 1, 0, this.yMax);
                break;
        }

        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPos.x * gridScaling, this.headPos.y * gridScaling, 1, this.tailPos);

        this.checkIsAlive();

        this.hasChangedDirection = false;
        this.timeToNextMove += this.timeBetweenMoves;
    },

    goLeft: function() {
        if((this.direction === directions.UP || this.direction === directions.DOWN) && !this.hasChangedDirection) {
            this.direction = directions.LEFT;
            this.hasChangedDirection = true;
        }
    },

    goRight: function() {
        if((this.direction === directions.UP || this.direction === directions.DOWN) && !this.hasChangedDirection) {
            this.direction = directions.RIGHT;
            this.hasChangedDirection = true;
        }
    },

    goUp: function() {
        if((this.direction === directions.LEFT || this.direction === directions.RIGHT) && !this.hasChangedDirection) {
            this.direction = directions.UP;
            this.hasChangedDirection = true;
        }
    },

    goDown: function() {
        if((this.direction === directions.LEFT || this.direction === directions.RIGHT) && !this.hasChangedDirection ) {
            this.direction = directions.DOWN;
            this.hasChangedDirection = true;
        }
    },

    checkIsAlive: function() {
        //Boundary collision check - will not be used if the game has wraparound enabled.
        let hasCollidedWithBoundary = this.headPos.x > this.xMax - 1 || this.headPos.y > this.yMax - 1 || this.headPos.x < 0 || this.headPos.y < 0
        let hasCollidedWithBody = Phaser.Actions.GetFirst(this.body.getChildren(), {
            x: this.head.x,
            y: this.head.y
        }, 1);
        if(hasCollidedWithBoundary || hasCollidedWithBody) {
            this.alive = false;
        }
    },

    increaseSpeed: function() {
        if(this.timeBetweenMoves > this.minTimeBetweenMoves) {
            this.timeBetweenMoves -= 10;
        }
    },

    addBodyPart: function() {
        let part = this.body.create(this.tailPos.x, this.tailPos.y, 'snake');
        part.setOrigin(0);
        this.bodyPartsAdded++;
        if(this.bodyPartsAdded % this.fruitsBetweenSpeedIncrease === 0) {
            this.increaseSpeed();
        }
    },

    isEatingFruit: function(fruit) {
        return this.head.x === fruit.x && this.head.y === fruit.y;
    }
})