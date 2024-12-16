import {MAIN_MENU_ASSET_KEYS} from "../../assets/assets-key.js";


export default class WorldContainer extends Phaser.GameObjects.Container {

    /** @type{Phaser.GameObjects.GameObject} */
    border

    constructor(scene, x, y) {
        super(scene);

        this.scene = scene;
        this.x = x;
        this.y = y;

        this.border = this.scene.add.nineslice(
            25, 25,
            MAIN_MENU_ASSET_KEYS.MENU_BORDER,
            0, 975, 525,
            10, 10, 10, 10
        ).setOrigin(0)


        this.on('visibilityChanged', (isVisible) => {
            this.scene.scene.get('UIScene').hideButtons(!isVisible);
            this.update()
        })

        this.add(this.border);
        this.scene.add.existing(this);
    }

    setVisible(value) {
        this.emit('visibilityChanged', value);  // Emit custom event
        return super.setVisible(value);
    }

    update(...args) {
        super.update(...args);
        this.x = this.scene.cameras.main.scrollX;
        this.y = this.scene.cameras.main.scrollY;
    }
}