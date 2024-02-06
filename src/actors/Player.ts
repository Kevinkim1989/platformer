export class Player {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private keys: { [key: string]: Phaser.Input.Keyboard.Key };
  private lastRightKeyTime: number;
  private lastLeftKeyTime: number;
  private isRunning: boolean = false;
  private jumpCount: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.resizeSpriteAndBounds();
    this.sprite.setCollideWorldBounds(true)

    this.lastRightKeyTime = 0;
    this.isRunning = false;  

    this.keys = {
      up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      jump: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    this.initAnims()
  }

  private resizeSpriteAndBounds(){
    this.sprite.setSize(20, 16);
    this.sprite.setOffset(22, 29);

    this.sprite.displayWidth *= 2;
    this.sprite.displayHeight *= 2;
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  private checkRunning(time: number){
    if (Phaser.Input.Keyboard.JustDown(this.keys.right)) {
      if (time - this.lastRightKeyTime <= 300) {
        this.isRunning = true;
      }
      this.lastRightKeyTime = time;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.left)) {
      if (time - this.lastLeftKeyTime <= 300) {
        this.isRunning = true;
      }
      this.lastLeftKeyTime = time;
    } 
  }

  private handleMovement(){
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
      this.sprite.flipX = true;
    } else if (this.keys.right.isDown) {
      this.sprite.setVelocityX(this.getSpeed());
      this.sprite.flipX = false;
    } else {
      this.sprite.setVelocityX(0);
      this.sprite.anims.play('idle', true);
      this.isRunning = false;
    }
  }

  private handleJump(){
    this.handleDoubleJump();
    if (!this.sprite.body?.touching.down) {
      this.sprite.setAccelerationY(this.sprite.body.acceleration.y + 5); // Adjust as needed
    } else {
      this.sprite.setAccelerationY(0);
      this.jumpCount = 0;
    }
  }

  private handleDoubleJump(){
    if (Phaser.Input.Keyboard.JustDown(this.keys.jump)) {
      if (this.jumpCount === 1) return;
      this.sprite.setVelocityY(-200);
      this.sprite.setAccelerationY(-50)
      this.jumpCount++;
    }
  }

  private getSpeed() {
    return this.isRunning ? 400 : 150;
  }

  private initAnims(){
    this.sprite.anims.create({
      key: 'idle',
      frames: this.sprite.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    })

    this.sprite.anims.create({
      key: 'walk',
      frames: this.sprite.anims.generateFrameNumbers('player-walk', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    })

    this.sprite.anims.create({
      key: 'run',
      frames: this.sprite.anims.generateFrameNumbers('player-run', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    })
  }

  update( time: number){
    this.checkRunning(time);
    this.handleMovement();
    this.handleJump();
  }

}