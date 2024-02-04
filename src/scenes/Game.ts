import { Scene, Physics, Input } from 'phaser';
import { Actor } from '../actors/Actor';
import { Enemy } from '../actors/Enemy';
import { Projectile } from '../actors/Projectile';
export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Actor;
    platforms: Physics.Arcade.StaticGroup;
    // cursors: Input.Keyboard.CursorKeys;
    enemies: Physics.Arcade.Group;
    projectiles: Physics.Arcade.Group;
    enemy: Enemy;

    constructor ()
    {
        super('Game');
    }

    preload(){
        this.load.setPath('assets');
        this.load.image('background', 'background.png');
        this.load.spritesheet('player', './assets/scout-idle.png'), {
            frameWidth: 10,
            frameHeight: 10
            };
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.createPlatforms();

        this.player = new Actor(this, 400, 300);
        this.physics.add.collider(this.player, this.platforms);


        this.enemies = this.physics.add.group();
        this.enemy = new Enemy(this, 200, 300);
        this.physics.add.collider(this.enemy, this.platforms);
        this.enemies.add(this.enemy);

        this.projectiles = this.physics.add.group({ 
            classType: Projectile
        });

        this.physics.add.collider(this.projectiles, this.platforms, (projectile, platform) => {
            projectile.destroy();
        });

        this.physics.add.collider(this.player, this.enemy, () => {
            this.player.takeDamage(10); // The player takes 10 damage when it collides with the enemy
        });

        this.physics.add.collider(this.projectiles, this.enemies, (projectile, enemy) => {
            projectile.destroy();
            enemy.destroy();
        });

        this.camera.startFollow(this.player);
    }

    update ()
    {
        this.player.update();
        if (!this.input.keyboard) throw new Error('No keyboard found');
        if (this.input.keyboard.addKey('SHIFT').isDown) {
            const projectile = this.player.fireProjectile();
            if (projectile) {
              this.projectiles.add(projectile); // add the projectile to the group
            }
        }

        this.projectiles.getChildren().forEach((projectile: any) => {
            projectile.update();
        });
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
