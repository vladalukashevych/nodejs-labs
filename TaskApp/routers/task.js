const express = require("express");
const taskModel = require("../models/task");
const auth = require("../src/middleware/auth");
const router = new express.Router();

router.get("/tasks", auth, async (req, res) => {
    try {
        const tasks = await taskModel.find({owner: req.user});
        res.status(200).send({tasks});
    } catch (e) {
        res.status(403).send("Tasks not found.")
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const task = await taskModel.findTask(id, req.user);
        await task.populate('owner');
        res.status(200).send({task});
    } catch (error) {
        res.status(404).send({message: "Not Found"});
    }
});

router.post('/tasks', auth, async (req, res) => {
    const task = new taskModel({
        ...req.body,
        owner: req.user.id
    });
    try {
        await task.save();
        task.populate('owner');
        res.status(200).send({task});
    } catch (e) {
        res.status(500).send(e);
    }
});


router.patch('/tasks/:id', auth, async (req, res) => {
    const fields = ['title', 'description', 'completed'];
    try {
        const task = await taskModel.findTask(req.params.id, req.user);
        fields.forEach((field) => {
            if (req.body[field]) {
                task[field] = req.body[field];
            }
        })
        task.save()
            .then((saved) => {
                res.status(200).send(saved);
            })
            .catch((err) => {
                res.status(500).send(err);
            })
    } catch (e) {
        res.status(404).send("Task not found or permission not granted.");
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const deletedTask = await taskModel.findOneAndDelete({_id: req.params.id, owner: req.user});
        if (!deletedTask)
            throw new Error();
        res.status(200).send({deletedTask, message: "Deleted"});
    } catch (error) {
        res.status(404).send({message: "Not Found"});
    }
});

router.delete('/tasks', auth, async (req, res) => {
    try {
        const deletedTask = await taskModel.deleteMany({owner: req.user});
        if (!deletedTask)
            throw new Error();
        res.status(200).send({deletedTask, message: "Deleted"});
    } catch (error) {
        res.status(403).send("Task not found.");
    }
});

module.exports = router;