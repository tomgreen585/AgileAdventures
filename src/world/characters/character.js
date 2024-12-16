import {DIRECTION} from "../../common/direction.js";
import {PLAYER_SPEED, TILE_SIZE} from "../../config.js";

/**
 * @typedef CharacterConfig
 * @type {object}
 * @property {Phaser.Scene} scene
 * @property {String} assetKey
 * @property {Number} [assetFrame = 0]
 * @property {Coordinate} position
 */

export class Character {
    /** @type {Phaser.Scene} */
    _scene;
    /** @protected @type {import('../../common/direction.js').Direction} */
    _direction;
    /** @protected @type {boolean} */
    _isMoving;
    /** @type {Phaser.GameObjects.Sprite} */
    _phaserGameObject;

    /**
     *
     * @param {CharacterConfig} config
     */
    constructor(config) {
        this._scene = config.scene;
        this._direction = DIRECTION.DOWN;
        this._isMoving = false;
        this._phaserGameObject = this._scene.add.sprite(config.position.x, config.position.y, config.assetKey, config.assetFrame || 0)
            .setOrigin(0);
    }

    /** @type {Phaser.GameObjects.Sprite} */
    get sprite() {
        return this._phaserGameObject;
    }

    /**
     * @returns {void}
     */
    update() {
        if (this._isMoving) {
            return;
        }

        switch (this._direction) {
            case DIRECTION.DOWN:
            case DIRECTION.LEFT:
            case DIRECTION.RIGHT:
            case DIRECTION.UP:
                this.idleMoveCharacter(this._direction);
                break;
            case DIRECTION.NONE:
                break;
            default:
        }
    }

    setPosition(newPosition) {
        this._phaserGameObject.x = newPosition.x;
        this._phaserGameObject.y = newPosition.y;
    }


    /** @type {DIRECTION} */
    moveCharacter(direction) {
        switch (direction) {
            case DIRECTION.DOWN:
                this._phaserGameObject.y += PLAYER_SPEED;
                break;
            case DIRECTION.UP:
                this._phaserGameObject.y -= PLAYER_SPEED;
                break;
            case DIRECTION.LEFT:
                this._phaserGameObject.x -= PLAYER_SPEED;
                break;
            case DIRECTION.RIGHT:
                this._phaserGameObject.x += PLAYER_SPEED;
                break;
            default:
                break
        }
    }

    // Calculate what the players future position would be base on the direction of the next move
    playerNextPosition(direction) {
        // Get the current player position
        let playerX = this._phaserGameObject.x;
        let playerY = this._phaserGameObject.y;

        // Move the player in the direction of the future move
        switch (direction) {
            case DIRECTION.DOWN:
                playerY += PLAYER_SPEED;
                break;
            case DIRECTION.UP:
                playerY -= PLAYER_SPEED;
                break;
            case DIRECTION.LEFT:
                playerX -= PLAYER_SPEED;
                break;
            case DIRECTION.RIGHT:
                playerX += PLAYER_SPEED;
                break;
            default:
                break
        }
        return {x: playerX, y: playerY}     // Return players next position
    }

    /** @return boolean *
     * @param {DIRECTION} direction
     * @param tilemapArray_
     * @returns {boolean}
     */
    // Converted position and convert to tile representation
    convertToTilePosition(position) {
        return {
            x: Math.floor(position.x / TILE_SIZE), // Divide by tile size (48x48)
            y: Math.floor((position.y + this._phaserGameObject.height / 1.5) / TILE_SIZE), // divide player height by 2 because the player is not centered
        };
    }

    /** @return boolean *
     * @param {DIRECTION} direction
     * @param tilemapArray_
     * @returns {boolean}
     */
    nextMoveWalkable(direction, tilemapArray_) {
        this.tilemapArray = tilemapArray_;  // Add tile map

        let futurePosition = this.playerNextPosition(direction);    // Get the future position of the player
        futurePosition = this.convertToTilePosition(futurePosition)      // Convert the future position to their tile values
        //console.log('Tilemap array', tileX, tileY, this.tilemapArray[tileY][tileX]);

        return this.isTileWalkable(futurePosition.x, futurePosition.y);   // Return false if the tile is not walkable
    }

    // Helper function to check if a tile is walkable
    isTileWalkable(tileX, tileY) {
        return this.tilemapArray[tileY][tileX] === -1;      // Return true if the tile is walkable (-1 value in the csv)
    }
}
