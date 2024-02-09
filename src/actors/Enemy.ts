import { Game } from "../scenes/Game";
import { Direction } from "../types";

export class Enemy {

  private scene: Game;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private direction: Direction = Direction.RIGHT;

  constructor(scene: Game, x: number, y: number) {
    this.scene = scene;
    this.sprite = this.scene.physics.add.sprite(x, y, 'enemy');
    this.resizeSpriteAndBounds();
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0.2);
    this.initAnims()
    this.sprite.anims.play('idle', true);
    this.sprite.setTint(0x00ff00);
  }

  private resizeSpriteAndBounds(){
    this.sprite.setSize(10, 15);
    this.sprite.setOffset(28, 30);

    this.sprite.displayWidth *= 2;
    this.sprite.displayHeight *= 2;
  }

  private initAnims(){
    this.sprite.anims.create({
      key: 'idle',
      frames: this.sprite.anims.generateFrameNumbers('enemy', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    })

    // this.sprite.anims.create({
    //   key: 'walk',
    //   frames: this.sprite.anims.generateFrameNumbers('player-walk', { start: 0, end: 7 }),
    //   frameRate: 10,
    //   repeat: -1,
    // })

    // this.sprite.anims.create({
    //   key: 'run',
    //   frames: this.sprite.anims.generateFrameNumbers('player-run', { start: 0, end: 7 }),
    //   frameRate: 10,
    //   repeat: -1,
    // })

    // this.sprite.anims.create({
    //   key: 'hit',
    //   frames: this.sprite.anims.generateFrameNumbers('player-hit', { start: 0, end: 2 }),
    //   frameRate: 10,
    //   repeat: -1,
    // })    
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public getHit(){
    console.log("Enemy hit!")
    this.sprite.setTint(0xff0000);
  }

  public die() {
    console.log("Enemy died!")
    this.sprite.setTint(0xff0000);
    // this.sprite.destroy();
  }
}