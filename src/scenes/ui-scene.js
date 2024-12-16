import {UI_ASSET_KEYS} from "../assets/assets-key";
import MinimapContainer from "./objects/minimap-container";
import KanbanBoard from "./objects/kanban-board";
import {KENNEY_FUTURE_FONT_NAME} from "../assets/font-keys";
import {SCENE_KEYS} from "./scene-keys";
import {HowToGame} from "./objects/how-to-play-game.js";
import {GameSettings} from "./objects/game-settings.js";
import {GameOverContainer} from "./objects/gameover-container.js";

// Text styles
const TEXT_STYLES = Object.freeze({
    menu: {
        fontFamily: KENNEY_FUTURE_FONT_NAME,
        color: '#FFFFFF',
        fontSize: '20px',
    }
});


export class UI extends Phaser.Scene {

    /** @type {MinimapContainer} */
    #miniMap;
    #miniMapButton
    #taskBar
    #kanBanButton
    /** @type {Phaser.GameObjects.Text}*/
    #progressText

    #gameOverContainer;

    /** @type {KanbanBoard} */
    #kanbanBoard;
    /** @type {HowToGame} */
    #howToPlayContainer;
    #howToPlayButton;

    /** @type {GameSettings} */
    #settingsContainer;
    #settingsButton;

    constructor() {
        super({key: 'UIScene'});
    }

    create() {
        this.#settingsContainer = new GameSettings(this, this.cameras.main.width / 2, this.cameras.main.height / 2)
            .setDepth(4)
            .setVisible(false)

        this.#gameOverContainer = new GameOverContainer(this, this.cameras.main.width / 2, this.cameras.main.height / 2)
            .setDepth(4)
            .setVisible(false)

        this.#settingsButton = this.add.image(this.cameras.main.width - 100, 0, UI_ASSET_KEYS.SETTINGS_BUTTON)  // Fixed screen coordinates, adjust as needed
            .setInteractive()
            .on("pointerdown", () => {
                this.#settingsContainer.setVisible(true);
            })
            .setDepth(4)
            .setOrigin(0)
            .setVisible(true)

        this.#howToPlayContainer = new HowToGame(this, this.cameras.main.width / 2, this.cameras.main.height / 2)
            .setDepth(4)
            .setVisible(false)
            .setSize(800, 600)
        this.#howToPlayContainer.setPosition(-700, 500);

        this.#howToPlayButton = this.add.image(this.cameras.main.width - 100, 145, UI_ASSET_KEYS.HELP_BUTTON)  // Fixed screen coordinates, adjust as needed
            .setInteractive()
            .on("pointerdown", () => {
                this.#howToPlayContainer.setVisible(true);
                this.hideButtons(false);
            })
            .setDepth(5)
            .setOrigin(0)
            .setVisible(true);

        //make task button
        this.taskButton = this.add.image(this.cameras.main.width - 100, 500, UI_ASSET_KEYS.TASK_BUTTON)  // Fixed screen coordinates, adjust as needed
            .setDepth(4)
            .setScale(0.2)
            .setAlpha(0.5)
            .setVisible(true)

        this.#miniMap = new MinimapContainer(this, this.cameras.main.scrollX, this.cameras.main.scrollY)
            .setDepth(2)
            .setVisible(false)

        this.#miniMapButton = this.add.image(this.cameras.main.width - 100, 70, UI_ASSET_KEYS.MAP_BUTTON)  // Fixed screen coordinates, adjust as needed
            .setInteractive()
            .on("pointerdown", () => {
                this.#miniMap.setVisible(true);
            })
            .setDepth(4)
            .setOrigin(0)
            .setVisible(true)

        this.#kanBanButton = this.add.image(this.cameras.main.width - 65, 260, UI_ASSET_KEYS.KANBAN_BUTTON)
            .setInteractive()
            .on("pointerdown", () => {
                this.#kanbanBoard.setVisible(true);
            })
            .setDepth(4)
            .setScale(0.3)
            .setVisible(true)

        this.#taskBar = this.add.image(0, 0, UI_ASSET_KEYS.TASK_BAR)  // Fixed screen coordinates, adjust as needed
            .setInteractive()
            .on("pointerdown", () => {
                this.#kanbanBoard.setVisible(true);
            })
            .setDepth(4)
            .setOrigin(0)
            .setVisible(true)
            .setScale(0.5)
        let tasks = this.scene.get(SCENE_KEYS.WORLD_SCENE).getTasks()
        this.#progressText = this.add.text(10, 7, "TOTAL TASK COMPLETED: " + tasks.size + "/" + tasks.size, TEXT_STYLES.menu)
            .setDepth(5)

        this.#kanbanBoard = new KanbanBoard(this, this.cameras.main.scrollX, this.cameras.main.scrollY)
            .setDepth(2)
            .setVisible(false);
    }

    hideButtons(val) {
        if (this.#miniMapButton) {
            this.#miniMapButton.setVisible(val);
            this.#settingsButton.setVisible(val);
            this.#kanBanButton.setVisible(val);
            this.#taskBar.setVisible(val);
            this.#progressText.setVisible(val);
            this.#howToPlayButton.setVisible(val);
            this.taskButton.setVisible(val);
        }
    }

    handleKanbanBoard() {
        this.#kanbanBoard.setVisible(true);
    }

    updateKanbanBoard() {
        this.#kanbanBoard.update()
    }

    makeKanbanBoard() {
        this.#kanbanBoard.makeButtons();
    }

    getTaskButton() {
        return this.taskButton;
    }

    handleGameOver(data) {
        this.#gameOverContainer.updateText(data);
        this.#gameOverContainer.setVisible(true);
    }

    update() {
        this.#miniMap.update();
        const tasks = this.scene.get(SCENE_KEYS.WORLD_SCENE).getTasks()
        const count = Array.from(tasks.values())
            .filter(task => task.state === 4)
            .length;
        this.#progressText.setText("TOTAL TASK COMPLETED: " + count + "/" + tasks.size, TEXT_STYLES.menu)

        if (this.#howToPlayContainer.visible) {
            this.hideButtons(false);
        }
    }
}