import { KENNEY_FUTURE_FONT_NAME } from "../../assets/font-keys.js";
import {HOW_TO_PLAY_ASSET_KEYS, ICON_ASSET_KEYS, MAIN_MENU_ASSET_KEYS } from "../../assets/assets-key.js";
import WorldContainer from './world-container.js';

const TEXT_STYLES = Object.freeze({
    instructions: {
        fontFamily: KENNEY_FUTURE_FONT_NAME,
        color: '#4D4A49',
        fontSize: '24px',
        wordWrap: { width: 600, useAdvancedWrap: true }
    }
});

export class HowToGame extends WorldContainer {
    constructor(scene, x, y) {
        super(scene, x, y);

        //from kanban board method for x and y on pop-up
        this.outerBorderThickness = 10;
        this.xStart = this.border.x + this.outerBorderThickness;
        this.yStart = this.border.y + this.outerBorderThickness;
        this.innerWidth = this.border.width - this.outerBorderThickness * 2;
        this.innerHeight = this.border.height - this.outerBorderThickness * 2;

        //add player image to bottom of container

        //add images to container -> player, kanban, 2 tasks
        const players = scene.add.image(0, 0, HOW_TO_PLAY_ASSET_KEYS.PLAYERS)
            .setOrigin(0.5)
            .setScale(0.5)
            .setDisplaySize(245, 200); //img size
        this.add(players);

        players.x = this.xStart + players.displayWidth / 2;
        players.y = this.yStart + this.innerHeight - players.displayHeight / 2;

        const kanban = scene.add.image(0, 0, HOW_TO_PLAY_ASSET_KEYS.KANBAN)
            .setOrigin(0.5)
            .setScale(0.5)
            .setDisplaySize(245, 200);
        this.add(kanban);
        
        kanban.x = players.x + 245;
        kanban.y = this.yStart + this.innerHeight - kanban.displayHeight / 2;

        const tasks = scene.add.image(0, 0, HOW_TO_PLAY_ASSET_KEYS.TASKS2)
            .setOrigin(0.5)
            .setScale(0.5)
            .setDisplaySize(245, 200);
        this.add(tasks);

        tasks.x = kanban.x + 245;
        tasks.y = this.yStart + this.innerHeight - tasks.displayHeight / 2;

        const tasks_two = scene.add.image(0, 0, HOW_TO_PLAY_ASSET_KEYS.TASKS)
            .setOrigin(0.5)
            .setScale(0.5)
            .setDisplaySize(230, 200);
        this.add(tasks_two);

        tasks_two.x = tasks.x + 230;
        tasks_two.y = this.yStart + this.innerHeight - tasks_two.displayHeight / 2;

        //store text for title
        const header_text = `How to play:`;

        //add text to container
        const header = scene.add.text(0, 0, header_text, {
            ...TEXT_STYLES.instructions,
            fontSize: '20px'
        }).setOrigin(0.5);
        this.add(header); 

        header.x = this.xStart + this.innerWidth / 2;
        header.y = this.yStart + 15;

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
        
        const instructions = scene.add.text(0, 0, instructionsText, {
            ...TEXT_STYLES.instructions,
            fontSize: '12px'
        }).setOrigin(0.5);
        this.add(instructions);  //add intstructiontext to container

        instructions.x = this.xStart + this.innerWidth / 2;
        instructions.y = this.yStart + 165;

        //add button to close down how to play pop-up
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
