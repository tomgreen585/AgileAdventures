const Task = require("./task.js");

class TaskFactory {
    static createTask(taskName) {
        switch (taskName) {
            case "Fixing Pipeline Error":
                return new Task("Fixing Pipeline Error", 0);
            case "AND-OR-XOR Gates":
                return new Task("AND-OR-XOR Gates", 4);
            case "Load Server":
                return new Task("Load Server", 3);
            case "Project Plan":
                return new Task("Project Plan", 2);
            case "Add stories":
                return new Task("Add stories", 1);
            default:
                throw new Error("Unknown task type");
        }
    }
}

function makeTasks() {
    const tasks = new Map();
    tasks.set("Fixing Pipeline Error", TaskFactory.createTask("Fixing Pipeline Error"));
    tasks.set("AND-OR-XOR Gates", TaskFactory.createTask("AND-OR-XOR Gates"));
    tasks.set("Load Server", TaskFactory.createTask("Load Server"));
    tasks.set("Project Plan", TaskFactory.createTask("Project Plan"));
    tasks.set("Add stories", TaskFactory.createTask("Add stories"));
    return tasks;
}

module.exports = makeTasks;