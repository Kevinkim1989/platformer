export class Projectile extends Phaser.Physics.Arcade.Sprite {
  direction: 'left' | 'right' = 'right'; // Add a direction property
  power: number = 500;
  
  constructor(scene: Phaser.Scene, x: number, y: number, direction: 'left' | 'right' = 'right') {
    super(scene, x, y, 'projectile');
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.direction = direction; 
  }

  fire(){
    if (this.direction === 'right') {
      this.setVelocityX(this.power);
    } else {
      this.setVelocityX(-this.power);
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