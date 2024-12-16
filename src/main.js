import {SCENE_KEYS} from "./scenes/scene-keys.js";
import {PreloadScene} from "./scenes/preload-scene.js";
import {MainMenuScene} from "./scenes/main-menu-scene.js";
import {WorldScene} from "./scenes/world-scene.js";
import {UI} from "./scenes/ui-scene.js";

const game = new Phaser.Game({
    type: Phaser.AUTO,
    scale: {
        parent: 'game-container',
        width: 1024,
        height: 576,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    // backgroundColor: '#FFFFFF',
})

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
game.scene.add(SCENE_KEYS.MAIN_MENU_SCENE, MainMenuScene)
game.scene.add(SCENE_KEYS.WORLD_SCENE, WorldScene)
game.scene.add('UIScene', UI)
game.scene.start(SCENE_KEYS.PRELOAD_SCENE);