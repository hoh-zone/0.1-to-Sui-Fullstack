import React, { useEffect } from 'react';
import Phaser from 'phaser';

const Game: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
    };

    const game = new Phaser.Game(config);
    let audioContext: AudioContext | null = null;

    function preload(this: Phaser.Scene) {
      this.load.image('tileset1', 'tilesets/tileset1.png');
      this.load.image('tileset2', 'tilesets/tileset2.png');
      this.load.tilemapTiledJSON('map', 'maps/lovelink-map.json');
    }

    function create(this: Phaser.Scene) {
      this.input.once('pointerdown', () => {
        if (!audioContext) {
          audioContext = new AudioContext();
        } else if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      });

      const map = this.make.tilemap({ key: 'map' });
      const tileset1 = map.addTilesetImage('TilesetNameInTiled1', 'tileset1');
      const tileset2 = map.addTilesetImage('TilesetNameInTiled2', 'tileset2');

      if (tileset1) {
        map.createLayer('LayerNameInTiled1', tileset1, 0, 0);
      }

      if (tileset2) {
        map.createLayer('LayerNameInTiled2', tileset2, 0, 0);
      }
    }

    function update(this: Phaser.Scene) {
      // 更新逻辑
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
};

export default Game;