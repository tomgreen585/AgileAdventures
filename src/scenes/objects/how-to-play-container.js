import { KENNEY_FUTURE_FONT_NAME } from "../../assets/font-keys.js";
import {HOW_TO_PLAY_ASSET_KEYS, ICON_ASSET_KEYS, MAIN_MENU_ASSET_KEYS } from "../../assets/assets-key.js";

const TEXT_STYLES = Object.freeze({
    instructions: {
        fontFamily: KENNEY_FUTURE_FONT_NAME,
        color: '#4D4A49',
        fontSize: '24px',
        wordWrap: { width: 600, useAdvancedWrap: true }
    }
});

export class HowToPlayContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        const background = scene.add.image(0, 0, MAIN_MENU_ASSET_KEYS.PANEL)
            .setOrigin(0.5)
            .setScale(1.5);
        this.add(background);

        //add menu background
        const serverBorder = scene.add.nineslice(
            0, 0,
            MAIN_MENU_ASSET_KEYS.MENU_BORDER,
            0, 1000, 550, //height-width
            10, 10, 10, 10
        ).setOrigin(0.5);
        this.add(serverBorder);  //add border to scne

        //add images to container -> player, kanban, 2 tasks
        const players = scene.add.image(-365, 165, HOW_TO_PLAY_ASSET_KEYS.PLAYERS)
            .setOrigin(0.5)
            .setScale(0.5)
            .setDisplaySize(250, 200); //img size
        this.add(players);

        const kanban = scene.add.image(-120, 165, HOW_TO_PLAY_ASSET_KEYS.KANBAN)
            .setOrigin(0.5)
            .setScale(0.5)
            .setDisplaySize(250, 200);
        this.add(kanban);

        const tasks = scene.add.image(133, 165, HOW_TO_PLAY_ASSET_KEYS.TASKS2)
            .setOrigin(0.5)
            .setScale(0.5)
            .setDisplaySize(250, 200);
        this.add(tasks);

        const tasks_two = scene.add.image(370, 165, HOW_TO_PLAY_ASSET_KEYS.TASKS)
            .setOrigin(0.5)
            .setScale(0.5)
            .setDisplaySize(243, 200);
        this.add(tasks_two);

        //store text for title
        const header_text = `How to play:`;

        //add text to container
        const header = scene.add.text(0, -245, header_text, {
            ...TEXT_STYLES.instructions,
            fontSize: '20px'
        }).setOrigin(0.5);
        this.add(header); 

        //instructions text
        const instructionsText = 
        `1. If you are wanting to create your own room for your friends, select  'Create'. From here you can name your room in the pop-up. Once you have named your room press 'OK' and this will transport you to your created room.
        2. Other players can then join your room by selecting the 'Join' button, where they will be presented with a pop-up which will display available/playable game rooms. This can be refreshed by using the button in the top left of the pop-up.
        3. Players will be able to move around the map using their arrow keys.
        4. The top-right corner indicates how many tasks have currently been completed, so the players in the room can track their progress.
        5. Players interact with kanban board pressing their spacebar. From here players will interact with the KanBan board by using their mouse.
        6. Players will carry out a number of tasks that they have to fix. Players will find tasks situated across the map that they will have to fix.
        7. Once tasks have been completed, players will update the KanBan board to indicate task progression.
        8. Once all tasks have been completed and have been successfully managed on the KanBan board the game is complete.
        `;
        
        const instructions = scene.add.text(0, -80, instructionsText, {
            ...TEXT_STYLES.instructions,
            fontSize: '12px'
        }).setOrigin(0.5);
        this.add(instructions);  //add intstructiontext to container

        //add button to close down how to play pop-up
        const backButton = scene.add.image(
            serverBorder.width / 2 - 20, -serverBorder.height / 2 + 20,
            ICON_ASSET_KEYS.CROSS
        ).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVisible(false);
                scene.buttonContainer.setVisible(true);
            });
        this.add(backButton);

        this.setVisible(false);
        scene.add.existing(this);
    }

    createButton(scene, x, y, text, onClick) {
        const button = scene.add.container(x, y);
        const buttonImage = scene.add.image(0, 0, MAIN_MENU_ASSET_KEYS.MENU_BUTTON)
            .setOrigin(0.5)
            .setScale(1.2)
            .setInteractive();

        const buttonText = scene.add.text(0, 0, text, TEXT_STYLES.instructions).setOrigin(0.5);

        button.add([buttonImage, buttonText]);
        buttonImage.on('pointerdown', onClick);

        return button;
    }
}
