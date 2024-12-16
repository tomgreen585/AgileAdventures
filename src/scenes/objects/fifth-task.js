import TaskSkeleton from "./task-skeleton.js";
import {TASK_ASSET_KEYS} from "../../assets/assets-key";
import {ICON_ASSET_KEYS} from "../../assets/assets-key";

export default class FifthTask extends TaskSkeleton {
    constructor(scene, x, y) {
        super(scene, x, y);

        //image background of task
        const backgroundOfTask = this.scene.add.image(33, 33, TASK_ASSET_KEYS.TASK_5)
            .setOrigin(0.0)
            .setDisplaySize(960, 465)
            .setAlpha(0.1)
        this.add(backgroundOfTask);

        this.backgroundOfTask = backgroundOfTask;
        //top right exit button which will exit the task
        const exitButton = this.scene.add.image(this.border.width, 35, ICON_ASSET_KEYS.CROSS)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVisible(false);
            });

        //line across bottom of screen separating the image and the UI for the task
        const line = this.scene.add.graphics();
        line.lineStyle(2, 0x000000, 1);
        line.moveTo(this.border.x + 8, this.border.y + this.border.height - 50);
        line.lineTo(this.border.x + this.border.width - 8, this.border.y + this.border.height - 50);
        line.strokePath();
        this.add(line);

        //num value for task progress level
        let progressValue = 0;

        //text for identifying the progress bar
        const progressText = this.scene.add.text(this.border.x + 320, this.border.y + 495, "Progress Bar")
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({color: '#000000'})

        //border for the progress bar (black)
        const progressBarBorder = this.scene.add.graphics();
        progressBarBorder.lineStyle(2, 0x000000, 1);
        progressBarBorder.strokeRect(this.border.x + 400, this.border.y + 485, 200, 20);

        //graphics fill for the progress bar (initial on load)
        const progressBarFill = this.scene.add.graphics();
        progressBarFill.fillStyle(0xFF0000, 1);
        progressBarFill.fillRect(this.border.x + 402, this.border.y + 487, 0, 16);

        this.isCompleted = Boolean(false);

        //button to the right of the progress bar user will click to increase the progress bar
        const incrementButton = this.scene.add.text(this.border.x + 670, this.border.y + 497, "TAP TO FIX")
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({backgroundColor: '#000000', color: '#ffffff'}) //button style and background
            .setInteractive() //set interactivity
            .on('pointerdown', () => {
                if (progressValue < 1) { //if not reached 100% progress
                    this.scene.tweens.add({
                        targets: {progressValue},
                        progressValue: Math.min(progressValue + 0.1, 1), //update progress value by 0.1
                        duration: 500, //graphics for extending the bar
                        ease: 'Linear', //graphics for extending the bar
                        onUpdate: function (tween) {
                            const progress = tween.getValue();
                            progressBarFill.clear(); //clears current progress bar state
                            progressBarFill.fillStyle(0x00ff00, 1); //fills += 0.1 state with green
                            progressBarFill.fillRect(this.border.x + 402, this.border.y + 487, progress * 196, 16); //fills the rectangle ^^

                            //update alpha of background image by .1 for each click
                            backgroundOfTask.setAlpha(progressValue + 0.1);
                        }
                            .bind(this),
                        onComplete: () => { //once completed button click progress
                            progressValue = Math.min(progressValue + 0.1, 1); //update progressValue
                            console.log("PROGRESS VALUE: " + progressValue);
                            if (progressValue == 1) { //if progress value at 100%
                                console.log("PROGRESS VALUE REACHED 1");

                                //create task completed button that appears in middle of screen
                                const taskCompletedButton = this.scene.add.text(this.border.x + 500, this.border.y + 200, "TASK COMPLETED", {fontSize: '40px'})
                                    .setOrigin(0.5)
                                    .setStyle({backgroundColor: '#000000', color: '#ffffff'})
                                    .setInteractive()
                                    .on('pointerdown', () => {
                                        this.setVisible(false); //will return player to world scene and hide the task
                                        this.isCompleted = true;
                                    });
                                this.add(taskCompletedButton);
                                setTimeout(() => {  this.setVisible(false); this.isCompleted = true; }, 2000); 
                            }
                        }
                    });
                }
            });

        this.add(incrementButton);
        this.add(progressText);
        this.add(progressBarBorder);
        this.add(progressBarFill);
        this.add(exitButton);
    }

    update() {
        super.update();
    }
}

