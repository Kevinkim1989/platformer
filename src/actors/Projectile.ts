export class Projectile extends Phaser.Physics.Arcade.Sprite {
  direction: 'left' | 'right' = 'right'; // Add a direction property
  power: number = 800;
  
  constructor(scene: Phaser.Scene, x: number, y: number, direction: 'left' | 'right' = 'right') {
    super(scene, x + 20, y - 10, 'projectile');
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.direction = direction;
    this.setSize(20, 10);
  }

  fire(){
    if (this.direction === 'right') {
      this.setVelocityX(this.power);
      this.setVelocityY(-10);
    } else {
      this.setVelocityX(-this.power);
      this.setVelocityY(-10);
    }
  }

  update() {
    // Add behavior that should happen every frame here.
    this.fire();
    // For example, you might want to destroy the projectile if it goes off screen:
    if (this.x < 0 || this.x > this.scene.scale.width || this.y < 0 || this.y > this.scene.scale.height) {
      this.destroy();
    }
  }
}