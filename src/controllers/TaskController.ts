import type { Request, Response } from "express";
import Task from "../models/Task";
import { taskBelongsToProject } from "../middleware/task";

export class TaskController {

    // Get all tasks from a project
    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate("project");
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Get task by Id
    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = req.task

            res.json(task);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Create a Task
    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body) 
            task.project = req.project.id
            req.project.tasks.push(task.id)
            //await task.save()
            //await req.project.save()
            await Promise.allSettled([task.save(), req.project.save()])

            res.status(201).json({ message: "Task created successfully", task });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Update a Task Status
    static updateTaskStatus = async (req: Request, res: Response) => {
        try {
            const task = req.task

            const { status } = req.body
            task.status = status

            await req.task.save()

            res.status(201).json({ message: "Task status updated successfully", task }); // Respuesta con código 201 Created

        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Update a Task
    static updateTask = async (req: Request, res: Response) => {
        try {
            const task = req.task

            task.taskName = req.body.taskName
            task.taskDescription = req.body.taskDescription
            await req.task.save()

            res.status(201).json({ message: "Task updated successfully", task });

        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Delete a Task
    static deleteTask = async (req: Request, res: Response) => {
        try {
            const task = req.task

            req.project.tasks = req.project.tasks.filter(task => task.toString() !== task.id.toString())

            /*
            await task.deleteOne()
            await req.project.save()
            */

            await Promise.allSettled([task.deleteOne(), req.project.save()])

            res.status(201).json({ message: "Task deleted successfully", task });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}