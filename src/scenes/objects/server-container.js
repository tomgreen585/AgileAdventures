import {ICON_ASSET_KEYS, MAIN_MENU_ASSET_KEYS} from "../../assets/assets-key.js";

export class ServerContainer extends Phaser.GameObjects.Container {

    constructor(scene, x, y) {
        super(scene);

        this.scene = scene;
        this.x = x;
        this.y = y;

        const serverBorder = this.scene.add.nineslice(
            0, 0,
            MAIN_MENU_ASSET_KEYS.MENU_BORDER,
            0, 400, 300,
            10, 10, 10, 10
        ).setOrigin(0.5);

        const exitButton = this.scene.add.image(
            serverBorder.width / 2 - 20, -serverBorder.height / 2 + 20,
            ICON_ASSET_KEYS.CROSS
        ).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVisible(false);
                this.scene.buttonContainer.setVisible(true);
            });

        // Create reload button
        const reloadButton = this.scene.add.image(
            -serverBorder.width / 2 + 30, -serverBorder.height / 2 + 30,
            ICON_ASSET_KEYS.RELOAD
        ).setOrigin(1)
            .setScale(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.loadServerList());

        const roomTitle = this.scene.add.text(this.width / 2, -120, "Rooms:").setOrigin(0.5);

        this.add([serverBorder, exitButton, reloadButton, roomTitle]);
        this.scene.add.existing(this);
    }
}