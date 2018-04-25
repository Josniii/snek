export default Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Fruit(x, y, scene) {
        Phaser.GameObjects.Image.call(this, scene);

        this.setTexture('fruit');
        this.setPosition(x * 20, y * 20);
        this.setOrigin(0);

        scene.children.add(this);
    },
})