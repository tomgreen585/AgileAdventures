import {ICON_ASSET_KEYS} from "../../assets/assets-key.js";
import {SCENE_KEYS} from "../scene-keys.js";
import TaskBox from './task-box.js';
import WorldContainer from './world-container.js';
import {getTask} from "../../utils/task-manager";

export default class KanbanBoard extends WorldContainer {

    constructor(scene, x, y) {
        super(scene, x, y);

        // List to store all tasks
        this.tasks = [];
        this.emptyTaskBoxes = [];
        this.taskButtons = new Map();

        this.backgroundColor = 737880;

        // Variables used for creating components
        this.outerBorderThickness = 10;
        this.innerBorderThickness = 3;
        this.xStart = this.border.x + this.outerBorderThickness;
        this.yStart = this.border.y + this.outerBorderThickness;
        this.innerWidth = this.border.width - this.outerBorderThickness * 2;
        this.innerHeight = this.border.height - this.outerBorderThickness * 2;

        // Draw frame and header
        this.drawKanbanFrame();

        this.taskColour = 0x63a6e6;
        this.taskWidth = this.innerWidth / 4;
        this.taskHeight = ((this.yStart + this.innerHeight) - (this.toDoText.y + this.toDoText.getBounds().height)) / 6;

        // Add toDoTasks
        this.initTaskBoxes(this.tasks);

        // Add empty boxes
        for (let col = 0; col < 4; col++) {
            let colList = [];

            for (let row = 0; row < 6; row++) {
                const emptyTask = new TaskBox(col, row, this.taskWidth, this.taskHeight, this.backgroundColor, true, "");
                colList.push(emptyTask);
            }

            this.emptyTaskBoxes.push(colList);
        }

        // Draw exit button
        const exitButton = this.scene.add.image(
            this.border.width, 35,
            ICON_ASSET_KEYS.CROSS
        ).setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => {
                this.setVisible(false);
                this.kanbanActive = false;
            });

        this.add(exitButton);
    }

    createDraggableButton(task, taskName) {
        let originalX = this.xStart + this.taskWidth / 2 + (this.taskWidth * task.col);
        let originalY = this.toDoText.y + this.toDoText.height + this.taskHeight / 2 + (this.taskHeight * task.row);
        this.emptyTaskBoxes[task.col][task.row].isEmpty = false; // Initializes as occupied square in emptyTaskBoxes

        // Create a draggable rectangle (button)
        const draggableButton = this.scene.add.rectangle(
            originalX,
            originalY,
            task.width,
            task.height,
            task.colour
        ).setInteractive({draggable: true});

        // Add properties to store the original position
        draggableButton.originalX = originalX;
        draggableButton.originalY = originalY;

        draggableButton.setDepth(1); // Initial depth to keep it above background but below other objects

        // Add text to the draggable button
        const buttonText = this.scene.add.text(
            originalX,
            originalY,
            task.text || taskName,
            {fontSize: '14px', fill: '#ffffff', align: 'center'}
        ).setOrigin(0.5); // Center the text on the button

        // Create an overlay layer if it doesn't exist (to hold dragged elements)
        if (!this.overlayLayer) {
            this.overlayLayer = this.scene.add.container().setDepth(10);
        }

        this.scene.input.setDraggable(draggableButton);

        // Variables to track the currently highlighted box
        let lastHighlightedBox = null;

        // Listen to drag events
        draggableButton.on('dragstart', (pointer, dragX, dragY) => {
            draggableButton.setFillStyle(0x00d412); // Change color to green on drag start

            // Move the button and text to the overlay layer
            this.overlayLayer.add(draggableButton);
            this.overlayLayer.add(buttonText);
        });

        draggableButton.on('drag', (pointer, dragX, dragY) => {
            draggableButton.x = dragX;
            draggableButton.y = dragY;

            // Move the text along with the draggable button
            buttonText.x = dragX;
            buttonText.y = dragY;

            // Use the pointer's position for accurate coordinates
            const moveTo = this.moveTaskBox(pointer.x, pointer.y);

            // Highlight the box if it's empty
            if (moveTo != null && this.emptyTaskBoxes[moveTo.col][moveTo.row].isEmpty) {
                if (lastHighlightedBox !== moveTo) {
                    // Remove highlight from the previously highlighted box
                    if (lastHighlightedBox != null) {
                        this.removeHighlight(lastHighlightedBox.col, lastHighlightedBox.row);
                    }

                    // Highlight the new box
                    this.highlightBox(moveTo.col, moveTo.row);
                    lastHighlightedBox = moveTo; // Track the highlighted box
                }
            } else if (lastHighlightedBox != null) {
                // Remove highlight if we're no longer over a valid empty box
                this.removeHighlight(lastHighlightedBox.col, lastHighlightedBox.row);
                lastHighlightedBox = null;
            }
        });

        draggableButton.on('dragend', (pointer) => {

            const taskObject = this.scene.scene.get(SCENE_KEYS.WORLD_SCENE).getTasks().get(taskName)
            draggableButton.setFillStyle(task.colour);

            const moveTo = this.moveTaskBox(pointer.x, pointer.y);

            if (
                moveTo != null &&
                this.emptyTaskBoxes[moveTo.col][moveTo.row].isEmpty
                && (
                    (moveTo.col > taskObject.state - 1 && taskObject.state - 1 === 0 && moveTo.col === 1) // Allow moving from column 0 to 1
                    || (moveTo.col === 2 && getTask(taskObject.taskNumber + "").isCompleted) // Move to column 2 if task is completed
                    || (moveTo.col === 3 && taskObject.state - 1 === 2 && !getTask(taskObject.taskNumber + "").isCompleted) // Move to column 4 from column 3 if task is not completed
                )
            ) {
                console.log(getTask(taskObject.taskNumber + ""));
                console.log(taskObject)
                let xPos = this.xStart + (this.taskWidth * moveTo.col);
                let yPos = this.toDoText.y + this.toDoText.height + (this.taskHeight * moveTo.row);

                this.scene.scene.get(SCENE_KEYS.WORLD_SCENE).sendUpdateTasks(taskName, moveTo.col + 1, moveTo.row);

                // Update the draggable button's position
                draggableButton.x = xPos + this.taskWidth / 2;
                draggableButton.y = yPos + this.taskHeight / 2;

                // Move the text along with the button
                buttonText.x = draggableButton.x;
                buttonText.y = draggableButton.y;

                // Mark the previous position as empty
                this.emptyTaskBoxes[task.col][task.row].isEmpty = true;

                // Mark the new position as occupied
                this.emptyTaskBoxes[moveTo.col][moveTo.row].isEmpty = false;

                // Update task position
                task.col = moveTo.col;
                task.row = moveTo.row;

                // Update originalX and originalY after a successful drag
                draggableButton.originalX = draggableButton.x;
                draggableButton.originalY = draggableButton.y;
            } else {
                // Revert to original position if the move is invalid
                draggableButton.x = draggableButton.originalX;
                draggableButton.y = draggableButton.originalY;

                // Move the text back to the original position
                buttonText.x = draggableButton.originalX;
                buttonText.y = draggableButton.originalY;
            }

            // Remove highlight from the last box (if any)
            if (lastHighlightedBox != null) {
                this.removeHighlight(lastHighlightedBox.col, lastHighlightedBox.row);
                lastHighlightedBox = null;
            }

            // Move the button and text back to the main container or board after dragging ends
            this.add(draggableButton);
            this.add(buttonText);
        });

        this.add(draggableButton);
        this.add(buttonText);

        this.taskButtons.set(buttonText, draggableButton);
    }

    // Helper function to highlight a task box
    highlightBox(col, row) {
        const box = this.emptyTaskBoxes[col][row];
        const boxX = this.xStart + (this.taskWidth * col);
        const boxY = this.toDoText.y + this.toDoText.height + (this.taskHeight * row);

        box.graphics = this.scene.add.graphics();
        box.graphics.lineStyle(3, 0xffff00); // Yellow highlight
        box.graphics.strokeRect(boxX, boxY, this.taskWidth, this.taskHeight);

        this.add(box.graphics);
    }

    // Helper function to remove highlight from a task box
    removeHighlight(col, row) {
        const box = this.emptyTaskBoxes[col][row];
        if (box.graphics) {
            box.graphics.clear(); // Clear the highlight graphics
            box.graphics.destroy(); // Remove the graphics from the scene
            box.graphics = null; // Clear the reference
        }
    }

    moveTaskBox(x, y) {
        let moveToBox = null;

        // Loop through empty task boxes
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 6; row++) {
                const currentBox = this.emptyTaskBoxes[col][row];
                let cBoxX = this.xStart + (this.taskWidth * currentBox.col);
                let cBoxY = this.toDoText.y + this.toDoText.height + (this.taskHeight * currentBox.row);

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

    writeListText(listName, i) {
        // Draw lists text
        const listText = this.scene.add.text(
            0, 0,
            listName,
            {fontSize: '16px', fill: '#ffffff'}
        );

        listText.x = this.xStart + ((this.innerWidth / 8) * (i + 2) - (listText.getBounds().width / 2));
        listText.y = this.kanbanBoardText.y + this.kanbanBoardText.getBounds().height + 10;

        this.add(listText);
        return listText;
    }

    // Initialize empty task boxes
    initTaskBoxes(list) {
        for (let row = 0; row < 6; row++) {
            const taskBox = new TaskBox(0, row, this.taskWidth, this.taskHeight, this.taskColour, false, "");
            list.push(taskBox);
        }
    }

    drawKanbanFrame() {
        // Background colour as rectangle
        const backgroundRect = this.scene.add.graphics();
        backgroundRect.fillStyle(this.backgroundColor);
        backgroundRect.fillRect(this.xStart, this.yStart, this.innerWidth, this.innerHeight).setDepth(3);
        this.add(backgroundRect);

        // Draw kanban board text
        this.kanbanBoardText = this.scene.add.text(
            this.border.x, this.border.y,
            'Kanban Board',
            {fontSize: '32px', fill: '#ffffff'}
        );

        this.kanbanBoardText.x = this.xStart + this.innerWidth / 2 - this.kanbanBoardText.width / 2;
        this.kanbanBoardText.y = this.yStart;

        this.add(this.kanbanBoardText);

        // Draw lists text
        this.toDoText = this.writeListText("TO DO", -1);
        this.writeListText("ON GOING", 1);
        this.writeListText("REVIEW", 3);
        this.writeListText("COMPLETED", 5);

        // Draw column lines
        for (let i = 1; i < 4; i++) {
            const lineX = this.xStart + (((this.innerWidth / 4) * i) - this.innerBorderThickness / 2);
            const lineStartY = this.kanbanBoardText.y + this.kanbanBoardText.getBounds().height;
            const lineEndY = this.yStart + this.innerHeight;

            const line = this.scene.add.graphics();
            line.lineStyle(this.innerBorderThickness, 0xc4c4c4, 1);
            line.beginPath();
            line.moveTo(lineX, lineStartY);
            line.lineTo(lineX, lineEndY);
            line.strokePath();
            this.add(line);
        }

        // Draw kanban header border
        const headerBorder = this.scene.add.graphics();
        headerBorder.lineStyle(this.innerBorderThickness, 0xc4c4c4, 1);
        headerBorder.beginPath();
        headerBorder.moveTo(this.xStart, this.kanbanBoardText.y + this.kanbanBoardText.getBounds().height);
        headerBorder.lineTo(this.xStart + this.innerWidth, this.kanbanBoardText.y + this.kanbanBoardText.getBounds().height);
        headerBorder.strokePath();
        this.add(headerBorder);
    }

    makeButtons() {
        let taskMap = this.scene.scene.get(SCENE_KEYS.WORLD_SCENE).getTasks();
        let i = 0;

        for (let n of taskMap.keys()) {
            console.log(n);
            this.createDraggableButton(this.tasks[i], n);
            i++;
        }
    }

    update() {
        let taskMap = this.scene.scene.get(SCENE_KEYS.WORLD_SCENE).getTasks();

        // Make all the empty boxes isEmpty values true
        for (let col = 0; col < 4; col++) {
            for (let row = 0; row < 6; row++) {
                this.emptyTaskBoxes[col][row].isEmpty = true;
            }
        }

        for (let taskName of taskMap.keys()) {
            for (let buttonText of this.taskButtons.keys()) {
                if (taskName == buttonText.text) {
                    let currentButton = this.taskButtons.get(buttonText);
                    let taskState = Number(taskMap.get(taskName).state) - 1;
                    let taskRow = taskMap.get(taskName).row;

                    // Reposition the task buttons
                    let xPos = this.xStart + this.taskWidth / 2 + (this.taskWidth * taskState);
                    let yPos = this.toDoText.y + this.toDoText.height + this.taskHeight / 2 + (this.taskHeight * taskRow);

                    currentButton.x = xPos;
                    buttonText.x = xPos;

                    currentButton.y = yPos;
                    buttonText.y = yPos;

                    // Update originalX and originalY for the new position
                    currentButton.originalX = xPos;
                    currentButton.originalY = yPos;

                    // Occupy current position
                    this.emptyTaskBoxes[taskState][taskRow].isEmpty = false;
                }
            }
        }
    }

    // Function to print the 2D array neatly
    printTaskBoxStatus() {
        let numRows = this.emptyTaskBoxes[0].length;
        let numCols = this.emptyTaskBoxes.length;

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
                const taskBox = this.emptyTaskBoxes[col][row];
                if (taskBox.isEmpty) {
                    rowStatus += '[T]       '; // 'T' for True (empty)
                } else {
                    rowStatus += '[F]       '; // 'F' for False (filled)
                }
            }
            console.log(rowStatus);
        }
    }
}
