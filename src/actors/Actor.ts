import { Projectile } from './Projectile';

export class Actor extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  hp: number
  direction: 'left' | 'right' = 'right'; // Add a direction property
  fireRate: number = 200; 
  lastFired: number = 0; 

  constructor(scene: Phaser.Scene, x: number = 100, y: number=100) {
    super(scene, x, y, 'player'); // The frame is optional 
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setGravityY(300);

    if (!this.scene.input.keyboard) throw new Error('No keyboard found');
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    
    this.hp = 100;
  }

  fireProjectile() {
    const time = this.scene.time.now;
    if (time - this.lastFired > this.fireRate) {
      const projectile = new Projectile(this.scene, this.x, this.y, this.direction);
      projectile.fire();
      this.lastFired = time;
      return projectile;
    }
    return null;
  }


  takeDamage(damage: number) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.destroy();
    }
  }

  update() {
    if (!this.scene.input.keyboard) throw new Error('No keyboard found');

    if (this.cursors.left.isDown || this.scene.input.keyboard.addKey('A').isDown) {
      this.setVelocityX(-160);
      this.direction = 'left'; // Update the direction property
    } else if (this.cursors.right.isDown || this.scene.input.keyboard.addKey('D').isDown) {
      this.setVelocityX(160);
      this.direction = 'right'; // Update the direction property
    } else {
      this.setVelocityX(0);
    }

    if ((this.cursors.space.isDown || this.cursors.up.isDown || this.scene.input.keyboard.addKey('W').isDown) && this.body?.touching.down) {
      this.setVelocityY(-330);
    }

    // if (this.scene.input.keyboard.addKey('SHIFT').isDown) {
    //   this.fireProjectile();
    // }
  }
}