const TaskState = require("./task-state.js");

class Task {

    /**@type string*/
    name
    /**@type TaskState*/
    state
    /**@type integer*/
    row
    /**@type integer*/
    taskNumber

    constructor(name, row) {
        this.name = name
        this.state = TaskState.TODO;
        this.row = row;
        this.taskNumber = row + 1;
    }

}

module.exports = Task;
