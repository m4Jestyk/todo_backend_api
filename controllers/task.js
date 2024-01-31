import { Task } from "../models/task.js";

export const newTask = async (req, res, next)=> {
    const {title, description} = req.body;

    await Task.create({
        title,
        description,
        user: req.user,
    })

    res.status(201).json({
        success: true,
        message: `task added`,
        taskDetails: `title: ${title}, desc: ${description}`,
    })
};

export const getMyTasks =async (req, res, next)=>{

    const user = req.user;

    console.log("working 1")

    const tasks = await Task.find({user: user._id});

    console.log("Wokring 2")

    res.status(200).json({
        success: true,
        tasks, 
    })
};

export const updateTask = async (req, res, next) =>{

    const {id} = req.params;

    const task = await Task.findById(id);

    task.isCompleted = !task.isCompleted;

    task.save();

    res.status(200).json({
        success: true,
        message: "Task updated",
    })
}

export const deleteTask = async (req, res, next) =>{

    const task = await Task.findById(req.params.id);

    if(!task){
        res.status(404).json({
            success: false,
            message: "Task not found",
        })
    }

    await task.deleteOne();

    res.status(200).json({
        success: true,
        message: "Task deleted",
    })


}