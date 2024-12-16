import {KENNEY_FUTURE_FONT_NAME} from "../../assets/font-keys.js";
import {ICON_ASSET_KEYS, MAIN_MENU_ASSET_KEYS} from "../../assets/assets-key.js";
import WorldContainer from './world-container.js';
import {SCENE_KEYS} from "../scene-keys.js";

const TEXT_STYLES = Object.freeze({
    instructions: {
        fontFamily: KENNEY_FUTURE_FONT_NAME,
        color: '#4D4A49',
        fontSize: '24px',
        wordWrap: {width: 600, useAdvancedWrap: true}
    }
});

export class GameSettings extends WorldContainer {
    constructor(scene, x, y) {
        super(scene, x, y);

        //from kanban board method for x and y on pop-up
        this.outerBorderThickness = 10;
        this.xStart = this.border.x + this.outerBorderThickness;
        this.yStart = this.border.y + this.outerBorderThickness;
        this.innerWidth = this.border.width - this.outerBorderThickness * 2;
        this.innerHeight = this.border.height - this.outerBorderThickness * 2;

        //create returnToMenuButton with text saying 'Quit'
        const returnToMenuButton = scene.add.text(this.border.width / 2, this.border.height / 2, 'Quit', {
            ...TEXT_STYLES.instructions,
            fontSize: '30px',
        }).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                location.reload();
            });

        returnToMenuButton.x = this.xStart + 500;
        returnToMenuButton.y = this.yStart + 400;
        this.add(returnToMenuButton);

        //CAN ADD OTHER FUNCTIONALITY IN THE SETTINGS MENU BUT FOR NOW QUIT IS THE FOCUS

        // add button to close down how to play pop-up
        const exitButton = this.scene.add.image(
            this.border.width, 35,
            ICON_ASSET_KEYS.CROSS
        ).setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVisible(false);
                this.kanbanActive = false;
            });
        this.add(exitButton);

        this.setVisible(false);
        scene.add.existing(this);
    }
}
