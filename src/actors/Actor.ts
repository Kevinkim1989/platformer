import Phaser from 'phaser';
import { Projectile } from './Projectile';
export class Actor extends Phaser.Physics.Arcade.Sprite {
  private direction: 'left' | 'right' = 'right';
  private fireRate: number = 100;
  private lastFired: number = 0;

  private jumpKey: Phaser.Input.Keyboard.Key;
  private isJumping: boolean = false;
  private jumpCount: number = 0;
  private maxJumpCount: number = 2; // For double jump

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.displayWidth *= 2;
    this.displayHeight *= 2;
    this.body?.setSize(20, 20);
    this.setOffset(21, 25);

    this.setCollideWorldBounds(true); // Prevent it from going out of the game world
    this.initAnimations();
  }

  private initAnimations(): void {

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 100 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player-walk', { start: 0, end: 100 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player-walk', { start: 0, end: 100 }),
      frameRate: 10,
      repeat: -1,
    })
    
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

  }
  

  public shoot(): void {
    const projectile = new Projectile(this.scene, this.x, this.y, this.direction);
    projectile.fire();

    // Add the projectile to a group of projectiles
    // this.scene.projectiles.add(projectile);
  }

  public setDirection(direction: 'left' | 'right'): void {
    this.direction = direction;
  }

  public getJumpCount(): number {
    return this.jumpCount;
  }

  public getIsJumping(): boolean {
    return this.isJumping;
  }

  public setIsJumping(isJumping: boolean): void {
    this.isJumping = isJumping;
  }

  public addJumpCount(): void {
    this.jumpCount++;
  }

  public getMaxJumpCount(): number {
    return this.maxJumpCount;
  }

  public getLastFired(): number {
    return this.lastFired;
  }

  public setLastFired(time: number): void {
    this.lastFired = time;
  }

  public getFireRate(): number {
    return this.fireRate;
  }
}
