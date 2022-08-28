'use strict';
const fs = require('fs');
const lockFile = require('lockfile')

//where tasks are stored
const tasksFile = './model/tasks.json'

const lock = './model/lock-file'


//Δημιουργός (constructor) ενός αντικειμένου τύπου Task
//Αν περαστεί ένα μόνο όρισμα, τότε τα άλλα δύο 
//status=0 σημαίνει η εργασία είναι ενεργή, 1 σημαίνει έχει ολοκληρωθεί 
//Constructor for a Task object. status 0 means that the task is active,
//status 1 means task is completed (striked-through)
exports.Task = function (taskName, status = 0, created_at = "") {

    let sysDate = new Date()
    let date = ("0" + sysDate.getDate()).slice(-2);
    let month = ("0" + (sysDate.getMonth() + 1)).slice(-2);
    let year = sysDate.getFullYear();
    let hrs = sysDate.getHours();
    let min = sysDate.getMinutes();
    let sec = sysDate.getSeconds();

    if (hrs < 10) {
        hrs = "0" + hrs;
    }

    if (sec < 10){
        sec = "0" + sec;
    }

    if (min < 10){
        min = "0" + min;
    }

    created_at = year + "-" + month + "-" + date + " " + hrs + ":" + min + ":" + sec;

    this.id = -1;
    this.task = taskName;
    this.status = status;  //0 -> active, 1 -> completed
    this.created_at = created_at; //date of creation

}

//Προβολή όλων των εργασιών - show all tasks
exports.getAllTasks = function (callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(tasksFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                callback(null, JSON.parse(data))
            })
        }
    })
}

//Προσθήκη εργασίας - Add a new task
exports.addTask = function (newTask, result) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            lockFile.unlock(lock);
            result.send(err.toString());
        }
        else {
            fs.readFile(tasksFile, (err, data) => {
                if (err) {
                    lockFile.unlock(lock);
                    result.send(err.toString());
                }

                let newEntry = JSON.parse(data)

                //Βρίσκουμε το μέγιστο id και θέτουμε το καινούριο id όσο αυτό συν 1
                let id = 0;
                newEntry.tasks.forEach(item => {
                    if (item.id > id) {
                        id = item.id;
                }});
                newTask.id = id + 1;
                

                //Προσθέτουμε το newTask στο JSON, μετατρέπουμε το JSON σε string και το γράφουμε στο αρχείο
                newEntry.tasks.push(newTask);
                fs.writeFile(tasksFile, JSON.stringify(newEntry), (err, data) => {
                    lockFile.unlock(lock);
                    if (err) {
                        result.send(err.toString());
                    }
                    else {
                        console.log("Task successfully added:", newTask);
                        result.send("" + newTask.id);
                    }
                });
            })
        }
    })
}

//Αφαίρεση μιας εργασίας - remove a task
exports.remove = function (taskToRemove, result) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            lockFile.unlock(lock);
            result.send(err.toString());
        }
        else {
            fs.readFile(tasksFile, (err, data) => {
                if (err) {
                    lockFile.unlock(lock);
                    result.send(err.toString());
                }

                //Ψάχνουμε το στοιχείο με το συγκεκριμένο id και το αφαιρούμε από τον πίνακα
                let newEntry = JSON.parse(data)
                newEntry.tasks.forEach(item => {
                    if (item.id == taskToRemove) {
                        newEntry.tasks.splice(newEntry.tasks.indexOf(item), 1);
                    }
                });

                //Γράφουμε το καινούριο json στο αρχείο, αφού το κάνουμε string
                fs.writeFile(tasksFile, JSON.stringify(newEntry), (err, data) => {
                    lockFile.unlock(lock);
                    if (err) {
                        result.send(err.toString());
                    }
                    else {
                        result.send("Ok!");
                    }
                });
            })
        }
    }) 
}

//Αλλαγή της κατάστασης μιας εργασίας - toggle task status
exports.toggleTask = function (taskId, result) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            lockFile.unlock(lock);
            result.send(err.toString());
        }
        else {
            fs.readFile(tasksFile, (err, data) => {
                if (err) {
                    lockFile.unlock(lock);
                    result.send(err.toString());
                }

                //Βρίσκουμε το task με το συγκεκριμένο id και ελέγχουμε το status του
                //Αν είναι 0, το θέτουμε 1. Στην αντίθετη περίπτωση, το θέτουμε 0
                let newEntry = JSON.parse(data)
                newEntry.tasks.forEach(item => {
                    if (item.id == taskId) {
                        if (item.status === 0) {
                            item.status = 1;
                        }
                        else {
                            item.status = 0;
                        }
                    }
                });
                
                //Γράφουμε το καινούριο json στο αρχείο, αφού το κάνουμε string
                fs.writeFile(tasksFile, JSON.stringify(newEntry), (err, data) => {
                    lockFile.unlock(lock);
                    if (err) {
                        result.send(err.toString());
                    }
                    else {
                        result.send("ok");
                    }
                });
            })
        }
    }) 
}