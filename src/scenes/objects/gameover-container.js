import {KENNEY_FUTURE_FONT_NAME} from "../../assets/font-keys.js";
import {ICON_ASSET_KEYS, MAIN_MENU_ASSET_KEYS} from "../../assets/assets-key.js";
import WorldContainer from './world-container.js';
import {SCENE_KEYS} from "../scene-keys.js";
import {GameSettings} from "./game-settings";

const TEXT_STYLES = Object.freeze({
    instructions: {
        fontFamily: KENNEY_FUTURE_FONT_NAME,
        color: '#4D4A49',
        fontSize: '24px',
        wordWrap: {width: 600, useAdvancedWrap: true}
    }
});

export class GameOverContainer extends WorldContainer {
    /** @type Phaser.GameObjects.Text **/
    #gameOverText;

    #timeText;

    #quitText;

    constructor(scene, x, y) {
        super(scene, x, y);
        this.#gameOverText = this.scene.add.text(this.border.width / 2, this.border.height / 2 - 50, 'gameOver', {
            ...TEXT_STYLES.instructions,
            fontSize: '30px',
        }).setOrigin(0.5, 0.5);


        this.add(this.#gameOverText);

        this.#timeText = this.scene.add.text(this.border.width / 2, this.border.height / 2, 'Quit', {
            ...TEXT_STYLES.instructions,
            fontSize: '30px',
        }).setOrigin(0.5, 0.5);


        this.add(this.#timeText);

        this.#quitText = this.scene.add.text(this.border.width / 2, this.border.height / 2 + 50, 'Quit', {
            ...TEXT_STYLES.instructions,
            color: 'red',
            fontSize: '30px',
        }).setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerdown', () => {
                location.reload();
            });

        this.add(this.#quitText);

    }

    updateText(time) {
        this.#timeText.setText("Your Time:" + time + "s");
    }
}
