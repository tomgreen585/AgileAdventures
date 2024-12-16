import TaskSkeleton from "./task-skeleton.js";
import {TASK_ASSET_KEYS, ICON_ASSET_KEYS} from "../../assets/assets-key";
import TaskBox from './task-box.js';

export default class SecondTask extends TaskSkeleton {
    isCompleted = false;

    constructor(scene, x, y) {
        super(scene, x, y);

        // Variables used for positioning components
        this.outerBorderThickness = 10;
        this.innerBorderThickness = 3;
        this.xStart = this.border.x + this.outerBorderThickness;
        this.yStart = this.border.y + this.outerBorderThickness;
        this.innerWidth = this.border.width - this.outerBorderThickness * 2;
        this.innerHeight = this.border.height - this.outerBorderThickness * 2;

        this.availablePositions = [];
        this.buttons = [];

        this.buttonLabels = ["Story 1", "Story 2", "Story 3", "Story 4"];

        // Change the 3 colours used in this task
        this.backgroundColor = 8951972
        this.buttonColour = 14538174
        this.buttonMovingColour = 10512187

        //image background of task
        const backgroundOfTask = this.scene.add.image(33, 33, TASK_ASSET_KEYS.TASK_2)
            .setOrigin(0.0)
            .setDisplaySize(960, 465)
            .setAlpha(0.1)
        this.add(backgroundOfTask);

        this.drawTaskFrame()    // Draw the task frame like headers and columns

        // Draw exit button
        const exitButton = this.scene.add.image(
            this.border.width - 15, 35 + 5,
            ICON_ASSET_KEYS.CROSS
        ).setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVisible(false);
            });
        this.add(exitButton);


        this.taskWidth = ((this.innerWidth / 4) - 3)    // -3 for spacing
        this.taskHeight = 112.5;                        // total height is 450 (112.5 * 4)

        // Add empty boxes  and create a draggable button for first column
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 2; col++) {
                const emptyTask = new TaskBox(col, row, this.taskWidth, this.taskHeight, this.backgroundColor, true, "");
                this.availablePositions[col] = this.availablePositions[col] || [];
                this.availablePositions[col].push(emptyTask);

                if (col === 0) {                                            // only create buttons for the first column
                    emptyTask.isEmpty = false;
                    const button = this.createDraggableButton(emptyTask);   // create a draggable button
                    this.buttons.push(button);                              // add button to the list of buttons
                }
            }
        }
        this.createAgileExplanationBox();
    }

    createDraggableButton(task) {
        // Define starting position for the button
        let originalX = this.xStart + this.taskWidth / 2 + (this.taskWidth * task.col);
        let originalY = (this.toDoText.y + this.toDoText.height + this.taskHeight / 2 + (this.taskHeight * task.row));

        // Create a rectangle for the draggable button
        let button = this.scene.add.rectangle(
            originalX, originalY, // x, y position
            this.taskWidth, this.taskHeight, // width, height of the button
            this.buttonColour // fill color of the button
        ).setInteractive({draggable: true}).setDepth(1);

        // Add properties to store the original position
        button.originalX = originalX;
        button.originalY = originalY;
        button.col = task.col;
        button.row = task.row;

        // Create an overlay layer if it doesn't exist (to hold dragged elements to avoid overlapping buttons)
        if (!this.overlayLayerT2) {
            this.overlayLayerT2 = this.scene.add.container().setDepth(10);
        }

        // Add a label (text) onto the button
        let buttonText = this.scene.add.text(
            originalX, originalY,
            `${this.buttonLabels[task.row]}`,  // Button number (1, 2, 3, 4)
            {fontSize: '24px', fill: '10987434'}
        ).setOrigin(0.5, 0.5).setDepth(2); // Center text on the button // Ensure the text appears on top of the button

        this.scene.input.setDraggable(button); // Enable dragging for the button


        // Add color change on drag start and end
        button.on('dragstart', (pointer) => {
            button.setFillStyle(this.buttonMovingColour); // Change color when dragging starts
            // Move the button and text to the overlay layer to prevent overlapping with other buttons when moving
            this.overlayLayerT2.add(button);
            this.overlayLayerT2.add(buttonText);
        });


        // Add dragging behavior
        button.on('drag', (pointer, dragX, dragY) => {
            // Update the button's position as it's dragged
            button.x = dragX;
            button.y = dragY;
            // Move the text along with the button
            buttonText.x = dragX;
            buttonText.y = dragY;
        });


        button.on('dragend', (pointer) => {
            // Find the nearest available grid position
            const nearestPosition = this.getNearestPosition(pointer.x, pointer.y);

            if (nearestPosition) {
                // If the position is available, snap to it and mark it as occupied
                if (nearestPosition.isEmpty) {
                    this.updatePosition(button, buttonText, nearestPosition);
                } else {
                    this.snapToOriginalPosition(button, buttonText);    // If the position is not available, revert to the original position
                }
            } else {
                this.snapToOriginalPosition(button, buttonText);    // If no valid position is found, revert to the original position
            }

            // Set button original position to the new position
            button.originalX = button.x;
            button.originalY = button.y;

            button.setFillStyle(this.buttonColour); // Revert to original color when dragging ends
            //this.printTaskBoxStatus();
            this.add(button);
            this.add(buttonText); // Ensure the text is still part of the scene

            this.checkIfDone(this.buttons);     // check if all buttons are in the second column
        });

        // Add the button to the scene
        this.add(button);
        this.add(buttonText); // Ensure the text is still part of the scene
        return button;
    }


    checkIfDone(buttons) {
        for (let button of buttons) {
            if (button.col === 0) return;  // Exit early if any button is in the first column
        }
        // create a button to exit the task
        const taskCompletedButton = this.scene.add.text(this.border.x + 500, this.border.y + 200, "TASK COMPLETED \n \n click to exit", {fontSize: '40px'})
            .setOrigin(0.5)
            .setStyle({backgroundColor: '#000000', color: '#ffffff'})
            .setInteractive()
            .setDepth(4) // set depth to 4 to ensure it appears on top of other elements
            .on('pointerdown', () => {
                this.setVisible(false); // will return player to world scene and hide the task
            });
        this.add(taskCompletedButton);  // add button to the scene
        this.buttons.forEach(b => this.scene.input.setDraggable(b, false)); // Disable dragging of all buttons
        this.isCompleted = true;
        setTimeout(() => {
            this.setVisible(false);
        }, 2000);   // wait 2 seconds before automatically closing the task
    }


    getNearestPosition(x, y) {
        let nearestPosition = null;

        // Loop through the available positions to find the closest empty one
        for (let col = 0; col < 2; col++) {
            for (let row = 0; row < 4; row++) {
                const currentBox = this.availablePositions[col][row];
                let cBoxX = this.xStart + (this.taskWidth * currentBox.col);
                let cBoxY = this.toDoText.y + this.toDoText.height + (this.taskHeight * currentBox.row);

                // Check if the dragged position is within the bounds of the current box
                if (x > cBoxX && x < cBoxX + this.taskWidth && y > cBoxY && y < cBoxY + this.taskHeight) {
                    nearestPosition = currentBox;
                    break;
                }
            }
        }
        return nearestPosition;
    }

    updatePosition(button, buttonText, newPosition) {
        // Mark the original position as empty
        this.availablePositions[button.col][button.row].isEmpty = true;

        // Add spacing so that button doesn't cover the column lines
        let spacing = 0;
        if (newPosition.col === 1) {
            spacing = 3;
        } // Spacing for the first column
        button.x = this.xStart + this.taskWidth / 2 + (this.taskWidth * newPosition.col) + spacing;
        button.y = this.toDoText.y + this.toDoText.height + this.taskHeight / 2 + (this.taskHeight * newPosition.row);
        button.col = newPosition.col;
        button.row = newPosition.row;
        // Update text position as well
        buttonText.x = button.x;
        buttonText.y = button.y;

        // Mark the new position as occupied
        this.availablePositions[button.col][button.row].isEmpty = false;
    }

    snapToOriginalPosition(button, buttonText) {
        // Revert the button to its original position
        button.x = button.originalX;
        button.y = button.originalY;
        buttonText.x = button.originalX;
        buttonText.y = button.originalY;
    }

    moveTaskBox(x, y) {
        let moveToBox = null;

        // Loop through empty task boxes
        for (let col = 0; col < 2; col++) {
            for (let row = 0; row < 4; row++) {
                const currentBox = this.emptyTaskBoxes[col][row];
                let cBoxX = this.xStart + (this.taskWidth * currentBox.col);
                let cBoxY = this.toDoText.y + this.toDoText.height + (this.taskHeight * currentBox.row);

                // Checks if the cursor is above the current box
                if (x > cBoxX && x < cBoxX + this.taskWidth) {
                    if (y > cBoxY && y < cBoxY + this.taskHeight) {
                        // Check if the box is empty
                        if (currentBox.isEmpty) {
                            moveToBox = currentBox;
                        }
                    }
                }
            }
        }
        return moveToBox;
    }


    drawTaskFrame() {
        // Background colour as rectangle
        const backgroundRect = this.scene.add.graphics();
        backgroundRect.fillStyle(this.backgroundColor);
        backgroundRect.fillRect(this.xStart, this.yStart, this.innerWidth, this.innerHeight).setDepth(3);
        this.add(backgroundRect);

        // Draw Task text
        this.taskTest = this.scene.add.text(
            this.border.x, this.border.y,
            'Plan Sprint',
            {fontSize: '32px', fill: '#ffffff'}
        );

        this.taskTest.x = this.xStart + this.innerWidth / 2 - this.taskTest.width / 2;
        this.taskTest.y = this.yStart;

        this.add(this.taskTest);    // Add the text to the task

        // Draw lists text
        this.toDoText = this.writeListText("Stories", -1);
        this.writeListText("Sprint", 1);

        // Draw column lines
        for (let i = 1; i < 3; i++) {
            const lineX = this.xStart + (((this.innerWidth / 4) * i) - this.innerBorderThickness / 2);
            const lineStartY = this.taskTest.y + this.taskTest.getBounds().height;
            const lineEndY = this.yStart + this.innerHeight;

            const line = this.scene.add.graphics();
            line.lineStyle(this.innerBorderThickness, 0xc4c4c4, 1);
            line.beginPath();
            line.moveTo(lineX, lineStartY);
            line.lineTo(lineX, lineEndY);
            line.strokePath();
            this.add(line);
        }

        // Draw task header border
        const headerBorder = this.scene.add.graphics();
        headerBorder.lineStyle(this.innerBorderThickness, 0xc4c4c4, 1);
        headerBorder.beginPath();
        headerBorder.moveTo(this.xStart, this.taskTest.y + this.taskTest.getBounds().height);
        headerBorder.lineTo(this.xStart + this.innerWidth, this.taskTest.y + this.taskTest.getBounds().height);
        headerBorder.strokePath();
        this.add(headerBorder);
    }

    writeListText(listName, i) {
        // Draw lists text
        const listText = this.scene.add.text(0, 0, listName, {fontSize: '16px', fill: '#ffffff'});
        listText.x = this.xStart + ((this.innerWidth / 8) * (i + 2) - (listText.getBounds().width / 2));
        listText.y = this.taskTest.y + this.taskTest.getBounds().height + 10;
        this.add(listText);
        return listText;
    }

    printTaskBoxStatus() {
        let numRows = this.availablePositions[0].length;
        let numCols = this.availablePositions.length;

        // Print row headers (these are now "columns" after rotation)
        let header = '    '; // For the column headers
        for (let col = 0; col < numCols; col++) {
            header += `   col ${col}  `;
        }
        console.log(header);

        // Iterate through each row, which now represents the rows after rotation
        for (let row = 0; row < numRows; row++) {
            let rowStatus = `row ${row}  `; // Start with the row label
            for (let col = 0; col < numCols; col++) {
                const taskBox = this.availablePositions[col][row];
                if (taskBox.isEmpty) {
                    rowStatus += '[T]       '; // 'T' for True (empty)
                } else {
                    rowStatus += '[F]       '; // 'F' for False (filled)
                }
            }
            console.log(rowStatus);
        }
    }

    createAgileExplanationBox() {
        // Create a text box on the right side for Agile Stories and Sprints explanation
        const textBoxWidth = 300;
        const textBoxHeight = 420;

        const textBackground = this.scene.add.graphics();
        textBackground.fillStyle(7174787, 1);
        textBackground.fillRect((this.border.width / 3) * 2 - 30, this.yStart + 50, textBoxWidth, textBoxHeight);
        this.add(textBackground);

        const agileExplanationText = `
Agile User Stories:
- User stories are brief descriptions of a feature from the perspective of the end user.
- They help break down requirements into small, manageable chunks.

Why User Stories:
- Promote collaboration.
- Provide clear understanding of goals.

Agile Sprints:
- Sprints are time-boxed iterations (usually 2-4 weeks).
- Teams focus on completing a set of user stories.

Importance:
- Deliver working software quickly.
- Allow for regular feedback and adjustments.
`;

        const agileText = this.scene.add.text(
            (this.border.width / 3) * 2 - 10, this.yStart + 50,
            agileExplanationText,
            {fontSize: '16px', fill: '#ffffff', wordWrap: {width: textBoxWidth - 20}}
        );
        this.add(agileText);
    }

    update() {
        super.update();
    }
}