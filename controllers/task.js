import errorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const newTask = async (req, res, next)=> {
    try {
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
    } catch (error) {
        next(error)
    }
};

export const getMyTasks =async (req, res, next)=>{
    try {
        
    const user = req.user;

    const tasks = await Task.find({user: user._id});

    res.status(200).json({
        success: true,
        tasks, 
    })
    } catch (error) {
        next(error)
    }
};

export const updateTask = async (req, res, next) =>{
    try {
        
    const {id} = req.params;

    const task = await Task.findById(id);

    task.isCompleted = !task.isCompleted;

    task.save();

    res.status(200).json({
        success: true,
        message: "Task updated",
    })
    } catch (error) {
        next(error)
    }
}

export const deleteTask = async (req, res, next) =>{
    try {
        
    const task = await Task.findById(req.params.id);

    if(!task){
        return next(new errorHandler("Task not found", 404))
    }

    await task.deleteOne();

    res.status(200).json({
        success: true,
        message: "Task deleted",
    })

    } catch (error) {
        next(error)
    }

}