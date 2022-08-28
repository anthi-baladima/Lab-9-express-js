'use strict';

const express = require('express');
const router = express.Router();

const taskListController = require('../controller/task-list-controller');

//when the client requests a URI, the corresponding controller function will be called
router.get('/tasks', taskListController.getAllTasks);

//add routes for 
//removing a task: /tasks/remove/:removeTaskId
router.get('/tasks/remove/:removeTaskId', taskListController.remove);

//adding a new task
router.get('/tasks/add/:newTask', taskListController.addTask);

//toggling a task
router.get('/tasks/toggle/:taskId', taskListController.toggle);

module.exports = router;