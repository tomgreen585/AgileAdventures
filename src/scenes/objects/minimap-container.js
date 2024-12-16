import {BACKGROUND_ASSET_KEYS, CHARACTER_ASSET_KEYS, ICON_ASSET_KEYS} from "../../assets/assets-key.js";
import WorldContainer from "./world-container.js";
import {SCENE_KEYS} from "../scene-keys";

export default class MinimapContainer extends WorldContainer {


    addImages() {
        //task layers
        this.taskLayer1 = this.scene.add.nineslice(25, 25, BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_1, 0, this.border.width - 10, this.border.height - 10,
            10, 10, 10, 10).setOrigin(0).setScale(1).setDepth(2);
        this.taskLayer2 = this.scene.add.nineslice(25, 25, BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_2, 0, this.border.width - 10, this.border.height - 10,
            10, 10, 10, 10).setOrigin(0).setScale(1).setDepth(2);
        this.taskLayer3 = this.scene.add.nineslice(25, 25, BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_3, 0, this.border.width - 10, this.border.height - 10,
            10, 10, 10, 10).setOrigin(0).setScale(1).setDepth(2);
        this.taskLayer4 = this.scene.add.nineslice(25, 25, BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_4, 0, this.border.width - 10, this.border.height - 10,
            10, 10, 10, 10).setOrigin(0).setScale(1).setDepth(2);
        this.taskLayer5 = this.scene.add.nineslice(25, 25, BACKGROUND_ASSET_KEYS.TASK_LAYER_MINI_5, 0, this.border.width - 10, this.border.height - 10,
            10, 10, 10, 10).setOrigin(0).setScale(1).setDepth(2);
        this.add(this.taskLayer1);
        this.add(this.taskLayer2);
        this.add(this.taskLayer3);
        this.add(this.taskLayer4);
        this.add(this.taskLayer5);
    }


    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene = scene;


        this.map = this.scene.add.nineslice(
            25, 25,
            BACKGROUND_ASSET_KEYS.MINIMAP,
            0, this.border.width - 10, this.border.height - 10,
            10, 10, 10, 10
        ).setOrigin(0);
        this.add(this.map);
        this.addImages();

        this.dot = this.scene.add.image(
            0,
            0,
            CHARACTER_ASSET_KEYS.CHARACTER1,
            20
        ).setOrigin(0).setScale(0.2);
        this.add(this.dot);

        // Add exit button to close the minimap
        const exitButton = this.scene.add.image(
            this.map.width, 35,
            ICON_ASSET_KEYS.CROSS
        ).setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVisible(false);
            });
        this.add(exitButton);

        this.scene.add.existing(this);
    }

    update(...args) {
        super.update(...args);

        this.x = this.scene.cameras.main.scrollX;
        this.y = this.scene.cameras.main.scrollY;

        // Update the player's dot position on the minimap
        const tile = this.scene.scene.get(SCENE_KEYS.WORLD_SCENE).getPlayerTilePosition();
        const offset = 25;
        const scaledX = (tile.x * (this.map.width / 7950));
        const scaledY = (tile.y * (this.map.height / 3250));

        this.dot.setPosition(offset + scaledX, offset + scaledY);
    }
}