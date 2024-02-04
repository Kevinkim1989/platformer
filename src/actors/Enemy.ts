export class Enemy extends Phaser.Physics.Arcade.Sprite {
  direction: 'left' | 'right' = 'right';
  hp: number = 100;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy'); // Use 'enemy' key here
    scene.physics.world.enable(this);
    scene.add.existing(this);
  }

  takeDamage(damage: number, direction: 'left' | 'right') {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.destroy();
    } else {
      this.pushBack(direction);
    }
  }

  pushBack(direction: 'left' | 'right') {
    if (direction === 'right') {
      this.setVelocityX(-200); // push back to the left
    } else {
      this.setVelocityX(200); // push back to the right
    }
  }
}