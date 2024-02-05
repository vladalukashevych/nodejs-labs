const express = require("express");
const TaskModel = require("../models/task");
const auth = require("../src/middleware/auth");
const router = new express.Router();

router.post('/task/add', auth, async (req,res)=>{
    const task = new TaskModel({...req.body, 
    owner: req.user.id
    });
    try{
      await task.save();
      task.populate('owner');
      res.status(200).send({task});
    }
    catch (e)
    {
        res.status(400).send(e);
    }
});
router.get('/task/:id', auth, async(req, res) => {
    const id = req.params.id;
    try{
      const task = await TaskModel.findTask(id, req.user);     
      await task.populate('owner');
      res.status(200).send({task});
    }
    catch(e)
    {
      res.status(404).send("Not Found")
    }
    
  });

router.get("/tasks", auth, async(req,res)=>
{
  try{
    const tasks = await TaskModel.find({owner: req.user}); 
    res.status(200).send({tasks});
  }
  catch(e)
  {
    res.status(404).send("Not Found")
  }
})

router.patch('/task/:id', auth ,async (req, res) => {
  const fields = ['title', 'description', 'done'];
  try{
    const task = await TaskModel.findTask(req.params.id, req.user);
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
  }
  catch(e)
  {
    res.status(403).send("Task not found");    
  }    
})

router.delete('/task/:id',auth ,async (req, res) => {   
  try {    
    const deletedTask = await TaskModel.findOneAndDelete({ _id:req.params.id, owner:req.user});
    if(!deletedTask)
      throw new Error();
    res.status(200).send({deletedTask, status: "Deleted"});
    } catch (error) {
      res.status(403).send("Task not found");
    }
  });
router.delete('/tasks',auth ,async (req, res) => {   
  try {     
    const deletedTask = await TaskModel.deleteMany({owner:req.user});
    if(!deletedTask)
      throw new Error();
    res.status(200).send({deletedTask, status: "Deleted"});
    } catch (error) {
      res.status(403).send("Task not found");
    }
  });

module.exports = router;