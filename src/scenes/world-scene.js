import {BACKGROUND_ASSET_KEYS, UI_ASSET_KEYS} from "../assets/assets-key.js";
import {DIRECTION} from "../common/direction.js";
import {TILE_SIZE} from "../config.js";
import {Controls} from "../utils/controls.js";
import {Player} from "../world/characters/player.js";
import {SCENE_KEYS} from "./scene-keys.js";
import {getTask, loadTasks} from "../utils/task-manager.js";

let socket;
let others = {};
let otherSprites = [];

/** @type {Coordinate} */
const PLAYER_POSITION = Object.freeze({
    x: 18 * TILE_SIZE,
    y: 20 * TILE_SIZE,
});

export class WorldScene extends Phaser.Scene {
    /** @type {Player} */
    #player;
    /** @type [Float] */
    #tileMapArray = [];  // Store the tilemap data
    #tasks = new Map();
    /** @type {Controls} */
    #controls;
    /** @type {string} */
    #currentRoom = ''; // Store the current room name
    /** @type { Phaser.GameObjects.Image} */
    #background

    constructor() {
        super({
            key: SCENE_KEYS.WORLD_SCENE,
            input: {
                activePointers: 3,  // Allow up to 3 active touch/mouse pointers
                useHandCursor: true // Ensure hand cursor is shown on interactive elements
            }
        });
        console.log(SCENE_KEYS.WORLD_SCENE);
    }

    init(data) {
        socket = data.socket;
        if (data.roomId) {
            this.#currentRoom = data.roomId;
            console.log(`Room ID received: ${this.#currentRoom}`);
        }
        // Listen for server events
        socket.on('updatePlayers', this.handleUpdatePlayers.bind(this));
        socket.on('playerMoved', this.handlePlayerMoved.bind(this));
        socket.on('disconnect', this.handlePlayerDisconnect.bind(this));
        socket.on('updateTasks', this.handleUpdateTasks.bind(this))
        socket.on('gameOver', this.handleGameOver.bind(this))
        this.sendUpdateTasks(null, null)
    }


    create() {
        console.log(`[${WorldScene.name}:create] invoke`);

        this.#tileMapArray = this.cache.text.get(BACKGROUND_ASSET_KEYS.WALL_CSV)
            .trim().split('\n').map(row => row.split(',').map(Number)); // Parse CSV into a 2D array of integers

        this.#background = this.add.image(0, 0, BACKGROUND_ASSET_KEYS.MAP).setOrigin(0).setScale(1);
        this.add.image(0, 0, BACKGROUND_ASSET_KEYS.WALLS).setOrigin(0).setScale(1).setDepth(1);

        //task layers
        this.addImages();

        this.scene.launch('UIScene');

        this.#controls = new Controls(this);
        this.#player = new Player({
            scene: this,
            position: PLAYER_POSITION,
        });

        this.cameras.main.setBounds(0, 0, this.#background.width, this.#background.height);
        this.cameras.main.startFollow(this.#player.sprite, true)

        loadTasks(this.scene.get('UIScene'));

        //closing down world scene listener
        this.events.on('shutdown', this.shutdown, this);
    }

    addImages() {
        //task layers
        this.taskLayer1 = this.add.image(0, 0, BACKGROUND_ASSET_KEYS.TASK_LAYER_1).setOrigin(0).setScale(1).setDepth(2);
        this.taskLayer2 = this.add.image(0, 0, BACKGROUND_ASSET_KEYS.TASK_LAYER_2).setOrigin(0).setScale(1).setDepth(2);
        this.taskLayer3 = this.add.image(0, 0, BACKGROUND_ASSET_KEYS.TASK_LAYER_3).setOrigin(0).setScale(1).setDepth(2);
        this.taskLayer4 = this.add.image(0, 0, BACKGROUND_ASSET_KEYS.TASK_LAYER_4).setOrigin(0).setScale(1).setDepth(2);
        this.taskLayer5 = this.add.image(0, 0, BACKGROUND_ASSET_KEYS.TASK_LAYER_5).setOrigin(0).setScale(1).setDepth(2);
    }

    // Update the player position
    update() {
        if (this.#controls.wasSpaceKeyPress()) {
            this.scene.get('UIScene').handleKanbanBoard()
        }

        for (let i = 1; i < 6; i++) {
            if (Array.from(this.#tasks.values()).some(task => task.state === 2 && task.taskNumber === i)) {
                this.taskLayer = this['taskLayer' + i];
                this.taskLayer.setVisible(true);
            } else {
                this.taskLayer = this['taskLayer' + i];
                this.taskLayer.setVisible(false);
            }
        }

        const selectedDirection = this.#controls.getDirectionKeyPressedDown();  // Get the direction selected by the player

        if (selectedDirection !== DIRECTION.NONE) {
            // Check if the next move is walkable if not exit movement function
            if (!this.#player.nextMoveWalkable?.(selectedDirection, this.#tileMapArray)) {
                // Get the player's future position and convert to tile representation
                let nextPosition = this.#player.convertToTilePosition(this.#player.playerNextPosition(selectedDirection));

                // Check if the future tile is a task tile
                let tileValue = this.#tileMapArray[Math.floor(nextPosition.y)][Math.floor(nextPosition.x)];

                if (tileValue > 0 && tileValue < 10) {  // Check if the tile is a task tile
                    console.log(tileValue);
                    console.log(this.#tasks.values())
                    if (Array.from(this.#tasks.values()).some(task => task.state === 2 && task.taskNumber === tileValue)) {
                        this.startInGameTask(tileValue);
                    }
                }

                return;  // return if the next move is not walkable, so walking is not executed
            }
            this.#player._isMoving = true;
            this.#player.moveCharacter?.(selectedDirection);

        } else {
            this.#player._isMoving = false;
        }

        // Update the kanban board and player after movement
        this.#player.update();
        this.scene.get('UIScene').update()
        // Send player position after movement
        this.sendPlayerPosition();
    }

    sendUpdateTasks(name, state, row) {
        socket.emit('taskMoved', {
            id: socket.id,
            roomName: this.#currentRoom,
            taskName: name,
            state: state,
            row: row
        });
    }

    handleGameOver(data) {
        this.scene.get('UIScene').handleGameOver(data);
    }

    handleUpdateTasks(updatedTasks) {
        const isFirstUpdate = this.#tasks.size === 0;
        updatedTasks.forEach((task) => {
            this.#tasks.set(task.name, {state: task.state, row: task.row, taskNumber: task.taskNumber});
        });
        if (isFirstUpdate) {
            this.scene.get('UIScene').makeKanbanBoard();
        }
        this.scene.get('UIScene').updateKanbanBoard();
    }

    // Send the player position to the server
    sendPlayerPosition() {
        const position = {x: this.#player.sprite.x, y: this.#player.sprite.y};
        let direction = this.#controls.getDirectionKeyPressedDown()
        socket.emit('playerMoved', {
            id: socket.id,
            position: position,
            direction: direction,
            isMoving: this.#player._isMoving,
            roomName: this.#currentRoom
        });
    }

    // Update the position of other players
    handleUpdatePlayers(players) {
        players.forEach(player => {
            if (player.id !== socket.id) {
                if (!others[player.id]) {
                    console.log(`[${player.id}] Player not found.`);
                    // Create new sprite for other player
                    let otherPlayer = new Player({
                        scene: this,
                        position: player.position,
                    });
                    others[player.id] = otherPlayer;
                    otherSprites.push(otherPlayer);
                } else {
                    if (player.isMoving) {
                        others[player.id].moveCharacter(player.direction);
                        others[player.id].setPosition(player.position);
                    } else {
                        others[player.id].update();
                    }
                }
            }
        });

        // Remove sprites for disconnected players
        Object.keys(others).forEach(id => {
            if (!players.find(p => p.id === id)) {
                this.handlePlayerDisconnect(id);
            }
        });
    }

    // Update the position of other players
    handlePlayerMoved(data) {
        const {id, position} = data;
        if (id !== socket.id && others[id]) {
            others[id].setPosition(position.x, position.y);
        }
    }

    // Remove the sprite of disconnected player
    handlePlayerDisconnect(id) {
        if (others[id]) {
            others[id]._phaserGameObject.destroy();
            delete others[id];
            otherSprites = otherSprites.filter(sprite => sprite !== others[id]);
        }
    }

    freezePlayer(val) {
        if (val === undefined) {
            console.warn("freezePlayer called without a value");
            return;
        }
        console.log(val);
        this.#controls.lockInput(Boolean(val));
    }

    getTasks() {
        return this.#tasks;
    }

    getPlayerTilePosition() {
        return {
            x: this.#player._phaserGameObject.x,
            y: this.#player._phaserGameObject.y
        };
    }

    startInGameTask(tileValue) {

        const uiScene = this.scene.get('UIScene');
        const taskButton = uiScene.getTaskButton(); // Get the task button from UIScene
        taskButton.setAlpha(1).setInteractive();
        taskButton.off('pointerdown');
        taskButton.on('pointerdown', () => {
            switch (tileValue) {
                case 1:
                    getTask('1').update();
                    getTask('1').setVisible(true);
                    break;
                case 2:
                    getTask('2').update();
                    getTask('2').setVisible(true);
                    break;
                case 3:
                    getTask('3').update();
                    getTask('3').setVisible(true);
                    break;
                case 4:
                    getTask('4').update();
                    getTask('4').setVisible(true);
                    break;
                case 5:
                    getTask('5').update();
                    getTask('5').setVisible(true);
                    break;
                default:
                    break;
            }
            taskButton.setAlpha(0.5);
            taskButton.removeInteractive();
        });
    }

    //shutdown code that would need to be called
    shutdown() {
        console.log(`[${WorldScene.name}:shutdown] Cleaning up...`);

        // Remove all socket event listeners
        socket.off('updatePlayers', this.handleUpdatePlayers.bind(this));
        socket.off('playerMoved', this.handlePlayerMoved.bind(this));
        socket.off('disconnect', this.handlePlayerDisconnect.bind(this));
        socket.off('updateTasks', this.handleUpdateTasks.bind(this));

        otherSprites.forEach(sprite => sprite._phaserGameObject.deleteScene());
        others = {};
        otherSprites = [];
    }

    //delete world scene
    deleteScene() {
        this.shutdown();
        super.destroy();
    }
}
