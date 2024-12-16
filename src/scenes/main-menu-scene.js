import { SCENE_KEYS } from "./scene-keys.js";
import { AUDIO_ASSET_KEYS, ICON_ASSET_KEYS, MAIN_MENU_ASSET_KEYS } from "../assets/assets-key.js";
import { KENNEY_FUTURE_FONT_NAME } from "../assets/font-keys.js";
import { playBackgroundMusic } from "../utils/audio-utils.js";
import {getSocket} from "../utils/socket.js";
import {ServerContainer} from "./objects/server-container.js";
import { HowToPlayContainer } from './objects/how-to-play-container.js';

const socket = getSocket();

// Text styles
const TEXT_STYLES = Object.freeze({
    menu: {
        fontFamily: KENNEY_FUTURE_FONT_NAME,
        color: '#4D4A49',
        fontSize: '20px',
    },
    title: {
        fontFamily: KENNEY_FUTURE_FONT_NAME,
        color: '#7994a0',
        fontSize: '50px',
    }
});

export class MainMenuScene extends Phaser.Scene {
    /** @type {ServerContainer} */
    #serverContainer;
    /** @type {HowToPlayContainer} */
    #howToPlayContainer;
    constructor() {
        super({ key: SCENE_KEYS.MAIN_MENU_SCENE });
        console.log(SCENE_KEYS.MAIN_MENU_SCENE);
    }

    create() {
        console.log(`[${MainMenuScene.name}:create] invoke`);

        // Background
        this.add.image(0, 0, MAIN_MENU_ASSET_KEYS.MAIN_MENU)
            .setOrigin(0);

        // Title
        this.add.image(this.scale.width / 2, 100, MAIN_MENU_ASSET_KEYS.TITLE).setScale(0.5)

        // Buttons
        this.createButtonContainer();

        // Server list
        this.#serverContainer = new ServerContainer(this, this.scale.width / 2, this.scale.height / 2 + 100);
        this.#serverContainer.setVisible(false);

        this.#howToPlayContainer = new HowToPlayContainer(this, this.scale.width / 2, this.scale.height / 2);
        this.#howToPlayContainer.setVisible(false);

        this.loadServerList();

        // playBackgroundMusic(this, AUDIO_ASSET_KEYS.MAIN_MENU);
    }

    createButtonContainer() {
        this.buttonContainer = this.add.container(this.scale.width / 2, this.scale.height / 2);

        const buttons = [
            { y: -55, text: 'Create', handler: () => this.handleStart() },
            { y: 35, text: 'Join', handler: () => this.handleJoinButton() },
            { y: 135, text: 'How To Play', handler: () => this.handleHTButton() },
            { y: 235, text: 'Settings', handler: () => this.handleStart() }
        ];

        buttons.forEach(({ y, text, handler }) => {
            const button = this.createButton(0, y, text, handler);
            this.buttonContainer.add(button);
        });
    }

    createButton(x, y, text, onClick) {
        const button = this.add.container(x, y);
        const buttonImage = this.add.image(0, 0, MAIN_MENU_ASSET_KEYS.MENU_BUTTON)
            .setOrigin(0.5)
            .setScale(1.2)
            .setInteractive();

        const buttonText = this.add.text(0, 0, text, TEXT_STYLES.menu).setOrigin(0.5);

        button.add([buttonImage, buttonText]);
        buttonImage.on('pointerdown', onClick);

        return button;
    }

    updateRoomList(roomNames) {
        // Clear existing room buttons
        this.#serverContainer.list.forEach(child => {
            if (child instanceof Phaser.GameObjects.Container) {
                child.destroy();
            }
        });

        // Create new buttons for rooms
        if(roomNames.length !== 0){
            const roomNamesArray = roomNames.split(',');
            const buttonSpacing = 80;
            console.log('found a room');
            //console log printing room name
            console.log(roomNamesArray);
            roomNamesArray.forEach((roomName, index) => {
                const serverButton = this.createButton(
                    0,
                    -this.#serverContainer.getAt(0).height / 2 + 100 + (index * buttonSpacing),
                    roomName,
                    () => this.handleRoomButtonClick(roomName)
                )
                this.#serverContainer.add(serverButton);
            });
        }
    }

    handleRoomButtonClick(roomName) {
        console.log(`Joining room: ${roomName}`);
        socket.emit('joinRoom', roomName);
        this.scene.start(SCENE_KEYS.WORLD_SCENE, { roomId: roomName, socket: socket });
    }

    handleStart() {
        console.log("Create room pressed");
        const newRoomName = prompt("Enter a name for the new room:");
        if (newRoomName) {
            socket.emit('createRoom', newRoomName);
            this.scene.start(SCENE_KEYS.WORLD_SCENE, { roomId: newRoomName, socket: socket });
        }
    }

    handleJoinButton() {
        this.buttonContainer.setVisible(false);
        this.#serverContainer.setVisible(true);
    }

    handleHTButton() {
        console.log("How to play pressed");
        this.buttonContainer.setVisible(false);
        this.#howToPlayContainer.setVisible(true);
    }

    loadServerList() {
        // Request initial room names from the server
        socket.emit('requestRoomNames');
        console.log("HERE BROSKI");
        // Handle the response from the server
        socket.on('roomNames', (roomNames) => {
            this.updateRoomList(roomNames);
        });
    }
}
