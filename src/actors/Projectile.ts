import { Direction } from '../types';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  private direction: Direction = Direction.RIGHT;
  private power: number = 500;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: Direction = Direction.RIGHT) {
    super(scene, x, y, 'projectile');
    this.direction = direction;

    // Add this game object to the owner scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  fire(x: number, y: number) {
    if (this.direction === Direction.LEFT) {
      this.setVelocityX(-this.power);
    } else {
      this.setVelocityX(this.power);
    }
  }
}