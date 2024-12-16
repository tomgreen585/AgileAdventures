import {DIRECTION} from "../common/direction.js";

export class Controls {
    /** @type {Phaser.Scene} */
    #scene;
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    #cursorKeys;
    /** @type {Boolean} */
    #lockPlayerMovement;

    /**
     *
     * @param scene
     */
    constructor(scene) {
        this.#scene = scene;
        this.#cursorKeys = this.#scene.input.keyboard.createCursorKeys();
        this.#lockPlayerMovement = false;
    }

    get isInputLocked() {
        return this.#lockPlayerMovement;
    }

    lockInput(val) {
        this.#lockPlayerMovement = Boolean(val);
    }

    wasSpaceKeyPress() {
        if (this.#cursorKeys === undefined) {
            return false;
        }
        return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space);
    }

    wasEscKeyPress() {
        if (this.#cursorKeys === undefined) {
            return false;
        }
        return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift);
    }


    /**
     *
     * @returns {DIRECTION}
     */
    getDirectionKeyPressedDown() {
        if (this.#cursorKeys === undefined || this.#lockPlayerMovement === true) {
            return DIRECTION.NONE;
        }

        /** @type {import('../../../Testing/src/common/direction.js').Direction} */
        let selectedDirection = DIRECTION.NONE;
        if (this.#cursorKeys.left.isDown) {
            selectedDirection = DIRECTION.LEFT;
        } else if (this.#cursorKeys.right.isDown) {
            selectedDirection = DIRECTION.RIGHT;
        } else if (this.#cursorKeys.up.isDown) {
            selectedDirection = DIRECTION.UP;
        } else if (this.#cursorKeys.down.isDown) {
            selectedDirection = DIRECTION.DOWN;
        }

        return selectedDirection;
    }
}