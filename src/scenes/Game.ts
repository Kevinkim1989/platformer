import { Scene, Physics, Input } from 'phaser';
import { Player } from '../actors/Player';
import { Projectile } from '../actors/Projectile';
import { Platform } from '../environ/Platform';
import { Enemy } from '../actors/Enemy';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player: Player;
  platforms: Physics.Arcade.StaticGroup;
  enemies: Physics.Arcade.Group;
  projectiles: Physics.Arcade.Group;
  attacks: Physics.Arcade.Group;
  spikes: Physics.Arcade.Group;
  enemy: Enemy;

  constructor() {
    super('Game');
  }

  preload() {
    this.load.setPath('assets');
    this.load.image('background', 'background.png');
    this.load.image('spikes', 'spikes.png');
    this.load.spritesheet('enemy', 'enemy-idle.png', { frameWidth: 64 });
    this.load.spritesheet('player', 'scout-idle.png', { frameWidth: 64 });
    this.load.spritesheet('player-run', 'scout-run.png', { frameWidth: 64 });
    this.load.spritesheet('player-walk', 'scout-walk.png', { frameWidth: 64 });
    this.load.spritesheet('player-hit', 'scout-hit.png', { frameWidth: 64 });
    this.load.spritesheet('projectile', 'scout-idle.png', { frameWidth: 16 });
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, 'background');
    this.background.setAlpha(0.5);

    this.createPlatforms();

    this.player = new Player(this, 400, 300);
    this.physics.add.collider(this.player.getSprite(), this.platforms);

    
    this.enemies = this.physics.add.group();
    this.enemy = new Enemy(this, 500, 300);
    this.enemies.add(this.enemy.getSprite());

    // for each enemy inside of enemies, add a collider with platforms
    this.enemies.getChildren().forEach((enemy: any) => {
      this.physics.add.collider(enemy, this.platforms);
    });

    this.enemies.getChildren().forEach((enemy: any) => {
      this.physics.add.collider(enemy, this.player.getSprite(), () => {
        this.player.getHit();
      });
    });

    this.projectiles = this.physics.add.group({
      immovable: true,
      allowGravity: false,
      classType: Projectile
    });

    this.physics.add.collider(this.projectiles, this.enemy.getSprite(), (projectile: any) => {
      projectile.destroy();
      this.enemy.die();
    } );

    this.spikes.getChildren().forEach((spike: any) => {
      this.physics.add.collider(spike, this.platforms);
      this.physics.add.collider(this.player.getSprite(), spike, () => {
        this.player.getHit();
      });
    });

    this.camera.startFollow(this.player.getSprite());
  }

  update() {
    this.player.update(this.time.now);
  }

  createPlatforms() {
    this.spikes = this.physics.add.group();
    this.spikes.create(300, 300, 'spikes').setScale(2).refreshBody().setSize(32, 5).setOffset(16,40);

    this.platforms = this.physics.add.staticGroup();
    this.platforms.add(new Platform(this, this.platforms, 500, 500, 1020, 32));
    this.platforms.add(new Platform(this, this.platforms, 200, 500, 50, 600));
    this.platforms.add(new Platform(this, this.platforms, 800, 500, 50, 600));
  }
}
