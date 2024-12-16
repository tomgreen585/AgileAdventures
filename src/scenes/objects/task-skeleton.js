import WorldContainer from "./world-container.js";
import {ICON_ASSET_KEYS} from "../../assets/assets-key";
import {SCENE_KEYS} from "../scene-keys";

export default class TaskSkeleton extends WorldContainer {


    constructor(scene, x, y) {
        super(scene, x, y);

        this.on('visibilityChanged', (isVisible) => {
            this.scene.scene.get(SCENE_KEYS.WORLD_SCENE).freezePlayer(isVisible);
            this.update()
        })
    }

    update(...args) {
        super.update(...args);
    }
}