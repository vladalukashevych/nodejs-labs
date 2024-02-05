const mongoose = require("mongoose");
const validator = require("validator");
const taskSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
 });

taskSchema.statics.findTask = async(id, user)=>
{
    
    const task = await Task.findOne({_id: id, owner: user});   
    if(!task)
    throw new Error();
    return task;
}

const Task = mongoose.model("Task", taskSchema);

 module.exports = Task;