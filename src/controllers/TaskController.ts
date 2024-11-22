import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
    static createProject = async (req: Request, res: Response) => {

        try {
            const task = new Task(req.body) 
            task.project = req.project.id
            req.project.tasks.push(task.id)
            await task.save()
            await req.project.save()

            res.status(201).json({ message: "Task created successfully", task });
        } catch (error) {
            console.log(error)
        }
    }
}