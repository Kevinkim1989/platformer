import { Scene, Physics, Input } from 'phaser';
import { Player } from '../actors/Player';
// import { Actor } from '../actors/Actor';
// import { Enemy } from '../actors/Enemy';
import { Projectile } from '../actors/Projectile';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;
    platforms: Physics.Arcade.StaticGroup;
    // cursors: Input.Keyboard.CursorKeys;
    enemies: Physics.Arcade.Group;
    projectiles: Physics.Arcade.Group;
    // enemy: Enemy;

    constructor ()
    {
        super('Game');
    }

    preload(){
        this.load.setPath('assets');
        this.load.image('background', 'background.png');
        this.load.spritesheet('player', 'scout-idle.png', {frameWidth: 64});
        this.load.spritesheet('player-run', 'scout-run.png', {frameWidth: 64});
        this.load.spritesheet('player-walk', 'scout-walk.png', {frameWidth: 64});
        this.load.spritesheet('projectile', 'scout-idle.png', {frameWidth: 16});
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.createPlatforms();

        this.player = new Player(this, 400, 300);
        this.physics.add.collider(this.player.getSprite(), this.platforms);

        this.projectiles = this.physics.add.group({ 
            classType: Projectile
        });

        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });
        // this.camera.startFollow(this.player);
    }

    update ()
    {
        this.player.update(this.time.now);
        // if (!this.input.keyboard) throw new Error('No keyboard found');

        // this.projectiles.getChildren().forEach((projectile: any) => {
        //     projectile.update();
        // });
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(200, 500, 'platform').setScale(2).refreshBody();
        this.platforms.create(200, 700, 'platform').setScale(2).refreshBody();
        this.platforms.create(300, 650, 'platform').setScale(2).refreshBody();
        this.platforms.create(400, 568, 'platform').setScale(2).refreshBody();
        this.platforms.create(500, 568, 'platform').setScale(2).refreshBody();
        this.platforms.create(600, 568, 'platform').setScale(2).refreshBody();
    }
}
