import {DATA_ASSET_KEYS} from "../assets/assets-key.js";


export class DataUtils {

    /**
     * Utility function for retrieving the Animation objects from the animations.json data file.
     * @param {Phaser.Scene} scene the Phaser 3 Scene to get cached JSON file from
     * @returns {import('../types/typedef.js').Animation[]}
     */
    static getAnimations(scene) {
        return scene.cache.json.get(DATA_ASSET_KEYS.ANIMATIONS);
    }
}