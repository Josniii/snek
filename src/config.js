export let xGridSize = 40;
export let yGridSize = 40;
export let gridScaling = 20;

export let config = {
    type: Phaser.AUTO,
    width: xGridSize*gridScaling,
    height: yGridSize*gridScaling,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
};