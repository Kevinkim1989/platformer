import { Projectile } from './Projectile';
import { Game } from "../scenes/Game";
import { Direction } from "../types";

export class Player {
  private scene: Game;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private keys: { [key: string]: Phaser.Input.Keyboard.Key };
  private direction: Direction = Direction.RIGHT;
  private isRunning: boolean = false;
  private jumpCount: number = 0;
  private lastJumpTime: number = 0;
  private jumpAcceleration: number = 0;
  private isKnockedBack: boolean = false;

  private meleeHitBox: Phaser.GameObjects.Rectangle;

  constructor(scene: Game, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.resizeSpriteAndBounds();
    this.sprite.setCollideWorldBounds(true)

    this.isRunning = false;  

    if (!scene.input.keyboard) return;
    this.keys = {
      up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      jump: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      run: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      shoot: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
      hit: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
    };

    this.initAnims()

    this.meleeHitBox = scene.add.rectangle(this.sprite.x, this.sprite.y+100, 20, 20, 0x0000ff);
  }

  private resizeSpriteAndBounds(){
    this.sprite.setSize(10, 15);
    this.sprite.setOffset(28, 30);

    this.sprite.displayWidth *= 2;
    this.sprite.displayHeight *= 2;
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  private checkRunning(){
    if (this.keys.run.isDown) {
      this.isRunning = true;
    } else {
      this.isRunning = false;
    }
  }

  private handleMovement(){
    if (this.isKnockedBack) return;
    if (this.keys.left.isDown && this.keys.right.isDown) {
      this.sprite.setVelocityX(0);
      this.sprite.anims.play('idle', true);
      this.isRunning = false;
      return;
    }

    if (this.keys.left.isDown || this.keys.right.isDown) {
      this.isRunning 
      ? this.sprite.anims.play('run', true) 
      : this.sprite.anims.play('walk', true);
    }

    if (this.keys.left.isDown) {
      this.sprite.setVelocityX(-this.getSpeed());
      this.direction = Direction.LEFT;
    } else if (this.keys.right.isDown) {
      this.sprite.setVelocityX(this.getSpeed());
      this.direction = Direction.RIGHT;
    } else {
      this.sprite.setVelocityX(0);
      this.sprite.anims.play('idle', true);
      this.isRunning = false;
    }

    if (this.direction === Direction.LEFT) {
      this.sprite.flipX = true;
    } else {
      this.sprite.flipX = false;
    }
  }

  private jump(newVelocityY: number = -200){
    this.sprite.setVelocityY(newVelocityY);
  }

  private knockBack(newVelocityY: number = 200){
    console.log("Knockback!")
    this.isKnockedBack = true;
    this.sprite.setTint(0xff0000);
    const pushDirection = this.direction === Direction.LEFT ? 1 : -1;
    const pushStrength = 50; // Adjust the strength as needed
    this.sprite.setVelocityY(-100);
    this.sprite.setVelocityX(pushStrength * pushDirection);
  }

  private handleJump(){
    if (!this.sprite.body) return;
    if (Phaser.Input.Keyboard.JustDown(this.keys.jump)) {
      if (this.jumpCount < 1){
        this.jump()
      }
      this.jumpCount++;
    }
  }

  private handleLand(){
    if (!this.sprite.body) return;
    if (this.sprite.body.touching.down) {
      this.jumpCount = 0;
      this.isKnockedBack = false;
      this.sprite.clearTint();
    }
  }

  private getSpeed() {
    return this.isRunning ? 200 : 50;
  }

  public handleHit(){
    this.sprite.anims.play('hit', true);
  }

  private initAnims(){
    this.sprite.anims.create({
      key: 'idle',
      frames: this.sprite.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    })

    this.sprite.anims.create({
      key: 'walk',
      frames: this.sprite.anims.generateFrameNumbers('player-walk', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    })

    this.sprite.anims.create({
      key: 'run',
      frames: this.sprite.anims.generateFrameNumbers('player-run', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    })

    this.sprite.anims.create({
      key: 'hit',
      frames: this.sprite.anims.generateFrameNumbers('player-hit', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    })    
  }

  public getHit(){
    this.knockBack()
  }

  private shoot(){
    const projectile = new Projectile(this.scene, this.sprite.x, this.sprite.y, this.direction);
    this.scene.projectiles.add(projectile);
    projectile.fire(this.sprite.x, this.sprite.y);
  }
  
  private slash(){
    console.log("Slash!")
    // This will be a melee attack, so we need to check for enemies in front of the player
    const slash = this.scene.add.rectangle(this.sprite.x + (this.direction === Direction.LEFT ? -24 : 24), this.sprite.y + 10, 20, 20, 0x0000ff);
    this.scene.physics.add.existing(slash);
    this.scene.physics.add.overlap(slash, this.scene.enemies, (slash) => {
      console.log("Enemy hit!")
      // enemy.setTint(0xff0000);
    });
  
  }

  private handleAttack(){
    if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
      this.shoot();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.hit)) {
      this.slash();
    }
  
  }

  private handleMeleeHitBox(){
    this.meleeHitBox.x = this.sprite.x + (this.direction === Direction.LEFT ? -24 : 24);
    this.meleeHitBox.y = this.sprite.y + 10;
  }

  update( time: number ){
    this.handleMeleeHitBox();
    this.checkRunning();
    this.handleMovement();
    this.handleJump();
    this.handleLand();
    this.handleAttack();
  }

}