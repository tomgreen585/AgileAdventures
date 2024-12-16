import TaskSkeleton from "../scenes/objects/task-skeleton.js";
import FirstTask from "../scenes/objects/first-task.js";
import SecondTask from "../scenes/objects/second-task.js";
import ThirdTask from "../scenes/objects/third-task.js";
import FourthTask from "../scenes/objects/fourth-task.js";
import FifthTask from "../scenes/objects/fifth-task.js";

let tasks = new Map();

export function getTask(taskKey) {
    if (tasks.has(taskKey)) {
        return tasks.get(taskKey);
    } else {
        return null;
    }
}

export function loadTasks(scene) {
    tasks.set('1', new FirstTask(scene, scene.cameras.main.scrollX, scene.cameras.main.scrollY)
        .setDepth(2)
        .setVisible(false))
    tasks.set('2', new SecondTask(scene, scene.cameras.main.scrollX, scene.cameras.main.scrollY)
        .setDepth(2)
        .setVisible(false))
    tasks.set('3', new ThirdTask(scene, scene.cameras.main.scrollX, scene.cameras.main.scrollY)
        .setDepth(2)
        .setVisible(false))
    tasks.set('4', new FourthTask(scene, scene.cameras.main.scrollX, scene.cameras.main.scrollY)
        .setDepth(2)
        .setVisible(false))
    tasks.set('5', new FifthTask(scene, scene.cameras.main.scrollX, scene.cameras.main.scrollY)
    .setDepth(2)
    .setVisible(false))
    
}