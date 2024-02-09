// export class Platforms {
//   private platforms: Platform[] = [];
//   constructor(scene: Phaser.Scene, platformData: { x: number, y: number }[]) {
//     platformData.forEach((data) => {
//       this.platforms.push(new Platform(scene, data.x, data.y));
//     });
//   }

//   public getPlatforms(): Platform[] {
//     return this.platforms;
//   }

// }
import { Physics } from "phaser";
export class Platform extends Phaser.GameObjects.GameObject {
  private sprite: Phaser.Physics.Arcade.Sprite;
  constructor(
    scene: Phaser.Scene, 
    group: Physics.Arcade.StaticGroup, 
    x: number, 
    y: number,
    width: number,
    height: number  
  ) {
    super(scene, 'platform');
    this.sprite = group.create(x, y, 'platform')
      .setSize(width, height);


    // this.sprite = scene.physics.add.sprite(x, y, d
  }

  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

}