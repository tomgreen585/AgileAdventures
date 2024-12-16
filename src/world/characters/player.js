import {Character} from "./character.js";
import {CHARACTER_ASSET_KEYS} from "../../assets/assets-key.js";
import {DIRECTION} from "../../common/direction.js";
import {TILE_SIZE} from "../../config.js";

/**
 * @typedef {Omit<CharacterConfig, 'assetKey', 'assetFrame'>} PlayerConfig
 *
 */
export class Player extends Character{

    /**
     *
     * @param {PlayerConfig} config
     */
    constructor(config) {
        //TO DO
        super({
            ...config,
            assetKey: CHARACTER_ASSET_KEYS.CHARACTER ,
            assetFrame: 0,
        });
    }

    // Write a method to return the players current position in the tiles
    /**
     * @returns {Coordinate}
     */
    get tilePosition() {
        return {
            // Calculate which tile the player would be standing on 
            x: Math.floor(this._phaserGameObject.x / TILE_SIZE), // Divide by tile size (48x48)
            y: Math.floor((this._phaserGameObject.y + this._phaserGameObject.height/2) / TILE_SIZE), // divide player height by 2 because the player is not centered
        };
    }

    /** @type {DIRECTION} */
    moveCharacter(direction) {

        super.moveCharacter(direction);
        let animationKey;

        switch (direction) {
            case DIRECTION.DOWN:
                animationKey = "PLAYER_WALK_DOWN";
                break;
            case DIRECTION.LEFT:
                animationKey = "PLAYER_WALK_LEFT";
                break;
            case DIRECTION.RIGHT:
                animationKey = "PLAYER_WALK_RIGHT";
                break;
            case DIRECTION.UP:
                animationKey = "PLAYER_WALK_UP";
                break;
            case DIRECTION.NONE:
                animationKey = "PLAYER_IDLE_DOWN";
                break;
            default:
                animationKey = null;
        }

        if (animationKey && 
            (!this._phaserGameObject.anims.isPlaying ||
            this._phaserGameObject.anims.currentAnim?.key !== animationKey)) {
            this._phaserGameObject.play(animationKey);
        }

        this._direction = direction; // Update the current direction
    }

        /** @type {DIRECTION} */
        idleMoveCharacter(direction) {
        
            let animationKey;
    
            switch (direction) {
                case DIRECTION.DOWN:
                    animationKey = "PLAYER_IDLE_DOWN";
                    break;
                case DIRECTION.LEFT:
                    animationKey = "PLAYER_IDLE_LEFT";
                    break;
                case DIRECTION.RIGHT:
                    animationKey = "PLAYER_IDLE_RIGHT";
                    break;
                case DIRECTION.UP:
                    animationKey = "PLAYER_IDLE_UP";
                    break;
                default:
                    animationKey = null;
            }
    
            if (animationKey && 
                (!this._phaserGameObject.anims.isPlaying ||
                this._phaserGameObject.anims.currentAnim?.key !== animationKey)) {
                this._phaserGameObject.play(animationKey);
            }
    
            this._direction = direction; // Update the current direction
        }

}
