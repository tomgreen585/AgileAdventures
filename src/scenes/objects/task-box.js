import KanbanBoard from "./kanban-board";

export default class TaskBox {
    constructor(col, row, width, height, colour, isEmpty, text) {
        this.col = col;
        this.row = row;
        this.width = width;
        this.height = height;
        this.colour = colour;
        this.isEmpty = isEmpty;
        this.text = text;
    }
}
