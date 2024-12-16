import {SCENE_KEYS} from "./scene-keys.js";
import {
    AUDIO_ASSET_KEYS,
    BACKGROUND_ASSET_KEYS,
    CHARACTER_ASSET_KEYS,
    DATA_ASSET_KEYS,
    ICON_ASSET_KEYS,
    MAIN_MENU_ASSET_KEYS, UI_ASSET_KEYS,
    TASK_ASSET_KEYS,
    HOW_TO_PLAY_ASSET_KEYS
} from "../assets/assets-key.js";
import {KENNEY_FUTURE_FONT_NAME} from "../assets/font-keys.js";
import {loadFont} from "../utils/font-utils.js";
import {DataUtils} from "../utils/data-utils.js";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
        });
        console.log(SCENE_KEYS.PRELOAD_SCENE)
    }

    preload() {
        console.log('preload')

        this.load.text(BACKGROUND_ASSET_KEYS.WALL_CSV, 'assets/map/engr-walls.csv');  // Load the CSV file as text
        this.load.image(MAIN_MENU_ASSET_KEYS.MAIN_MENU, 'assets/images/main-menu.png')
        this.load.image(UI_ASSET_KEYS.MAP_BUTTON, 'assets/UI/minimap-button.png')
        this.load.image(UI_ASSET_KEYS.SETTINGS_BUTTON, 'assets/UI/settings-button.png')
        this.load.image(UI_ASSET_KEYS.TASK_BAR, 'assets/UI/task-bar.png')
        this.load.image(UI_ASSET_KEYS.HELP_BUTTON, 'assets/UI/help-button.png')
        this.load.image(UI_ASSET_KEYS.TASK_BUTTON, 'assets/UI/task-button.png')
        this.load.image(UI_ASSET_KEYS.KANBAN_BUTTON, 'assets/UI/kanban-button.png')
        this.load.image(MAIN_MENU_ASSET_KEYS.MENU_BUTTON, 'assets/images/menu-button.png')
        this.load.image(MAIN_MENU_ASSET_KEYS.MENU_BORDER, 'assets/images/menu-border.png')
        this.load.image(BACKGROUND_ASSET_KEYS.MAP, 'assets/map/engr-map.png')
        this.load.image(BACKGROUND_ASSET_KEYS.MINIMAP, 'assets/map/engr-minimap.png')
        this.load.image(MAIN_MENU_ASSET_KEYS.TITLE, 'assets/images/menu-title.png')
        this.load.image(ICON_ASSET_KEYS.CROSS, 'assets/images/icon-cross.png')
        this.load.image(ICON_ASSET_KEYS.RELOAD, 'assets/images/icon-reload.png')
        this.load.image(BACKGROUND_ASSET_KEYS.WALLS, 'assets/map/engr-map-walls.png')

        //task layers
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_1, 'assets/map/layer_tasks/layer_task_3.png')
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_2, 'assets/map/layer_tasks/layer_task_5.png')
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_3, 'assets/map/layer_tasks/layer_task_1.png')
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_4, 'assets/map/layer_tasks/layer_task_2.png')
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_5, 'assets/map/layer_tasks/layer_task_4.png')

        //task layers
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_1, 'assets/map/layer_tasks_mini/layer_task_1.png')
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_2, 'assets/map/layer_tasks_mini/layer_task_2.png')
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_3, 'assets/map/layer_tasks_mini/layer_task_3.png')
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_4, 'assets/map/layer_tasks_mini/layer_task_4.png')
        this.load.image(BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_5, 'assets/map/layer_tasks_mini/layer_task_5.png')

        this.load.spritesheet(`CHARACTER`, `assets/images/character6.png`, {
            frameWidth: 48,
            frameHeight: 96
        });

        // Load animations
        this.load.json(DATA_ASSET_KEYS.ANIMATIONS, 'assets/data/animations.json');


        //for tasks
        this.load.image(TASK_ASSET_KEYS.TASK_1, 'assets/images/pipeline_task.png')
        this.load.image(TASK_ASSET_KEYS.TASK_2, 'assets/images/project_task.png')
        this.load.image(TASK_ASSET_KEYS.TASK_3, 'assets/images/review_task.png')
        this.load.image(TASK_ASSET_KEYS.TASK_4, 'assets/images/server_task.png')
        this.load.image(TASK_ASSET_KEYS.TASK_5, 'assets/images/XOR_task.png')

        //how to play images
        this.load.image(HOW_TO_PLAY_ASSET_KEYS.PLAYERS, 'assets/images/players.png')
        this.load.image(HOW_TO_PLAY_ASSET_KEYS.KANBAN, 'assets/images/kanban.png')
        this.load.image(HOW_TO_PLAY_ASSET_KEYS.TASKS, 'assets/images/tasks.png')
        this.load.image(HOW_TO_PLAY_ASSET_KEYS.TASKS2, 'assets/images/task-2.png')

        this.load.json(DATA_ASSET_KEYS.ANIMATIONS, 'assets/data/animations.json')
        loadFont(KENNEY_FUTURE_FONT_NAME, 'assets/fonts/kenney-future.ttf');
        this.load.audio(AUDIO_ASSET_KEYS.MAIN_MENU, 'assets/audio/main-menu-music.ogg');
    }

    create() {
        console.log(`[${PreloadScene.name}:create] invoke`);
        this.#createAnimations();
        this.scene.start(SCENE_KEYS.MAIN_MENU_SCENE)
    }

    /**
     * @returns {void}
     */
    #createAnimations() {
        const animations = DataUtils.getAnimations(this);
        animations.forEach((animation) => {
            const frames = animation.frames
                ? this.anims.generateFrameNumbers(animation.assetKey, {frames: animation.frames})
                : this.anims.generateFrameNumbers(animation.assetKey);
            this.anims.create({
                key: animation.key,
                frames: frames,
                frameRate: animation.frameRate,
                repeat: animation.repeat,
                delay: animation.delay,
                yoyo: animation.yoyo,
            });
        });
    }
}