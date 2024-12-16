const makeTasks = require("./task-factory.js");
const TaskState = require("./task-state.js");

class Room {
    /**@type string*/
    roomName
    /** @type {Map<string, Task>} */
    tasks
    /**@type integer*/
    startTime = Date.now()
    /**@type []*/
    players = [];

    constructor(name) {
        this.name = name;
        this.tasks = makeTasks()
    }

    getPlayers() {
        return this.players;
    }

    setPlayers(players) {
        this.players = players;
    }

    newPlayer(player) {
        this.players.push(player);
    }

    getTasks() {
        return this.tasks;
    }

    gameOver() {
        const completedTasks = Array.from(this.tasks.values()).filter(task => task.state === 4);
        return completedTasks.length === this.tasks.size;
    }

    gameTime() {
        return Math.floor(Date.now() - this.startTime) / 1000;
    }
}


module.exports = Room;