import directions from "./directions";
import config from './config';

export default Phaser.Class({

    initialize:

    function Snake(x, y, scene) {

        this.xMax = config.width;
        this.yMax = config.height;

        //Setting up the body and the head.
        this.body = scene.add.group();
        this.head = this.body.create(x * 20, y * 20, 'snake');
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
                this.headPos.x = Phaser.Math.Wrap(this.headPos.x - 1, 0, 40);
                break;
            case (directions.RIGHT):
                this.headPos.x = Phaser.Math.Wrap(this.headPos.x + 1, 0, 40);
                break;
            case (directions.UP):
                this.headPos.y = Phaser.Math.Wrap(this.headPos.y - 1, 0, 40);
                break;
            case (directions.DOWN):
                this.headPos.y = Phaser.Math.Wrap(this.headPos.y + 1, 0, 40);
                break;
        }

        //TODO: Death handling, should be moved to a seperate function probably?
        if(
            this.head.x >= this.xMax ||
            this.head.y >= this.yMax ||
            this.head.x < 0 ||
            this.head.y < 0
        ) {
            this.alive = false;
            console.log("u ded");
        }

        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPos.x * 20, this.headPos.y * 20, 1, this.tailPos);

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