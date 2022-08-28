'use strict';
/** You can define other models as well, e.g. postgres */
const model = require('../model/task-list-model-no-db.js');

exports.getAllTasks = (req, res) => {
    console.log("getAllTasks")
    model.getAllTasks((err, tasks) => {
        if (err) {
            res.send(err);
        }
        res.render('tasks', tasks);
    });
}

//add more controller functions, to be called when a user requests a specific
//route. each function will call the 'model', perform whatever calculations are
//necessary, and send the response to the client

exports.addTask = (req, res) => {
    console.log("addTask");
    const createTask = new model.Task(req.params.newTask);
    model.addTask(createTask, res);
}

exports.remove = (req, res) => {
    console.log("removeTask");
    const taskId = req.params.removeTaskId;
    model.remove(taskId, res);
}

exports.toggle = (req, res) => {
    console.log("toggleTask");
    const taskId = req.params.taskId;
    model.toggleTask(taskId, res);
}