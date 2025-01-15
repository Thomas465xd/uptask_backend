import type { Request, Response, NextFunction } from "express";
import Task, { TaskInterface } from "../models/Task";

declare global {
    namespace Express {
        interface Request {
            task: TaskInterface
        }
    }
}

export async function taskExists( req: Request, res: Response, next: NextFunction ) {
    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)

        if(!task) {
            const error = new Error("Task not found")
            res.status(404).json({error: error.message})
            return
        }

        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: "Internal server error"})
    }
}

export function taskBelongsToProject( req: Request, res: Response, next: NextFunction ) {
    if(req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error("Action not allowed")
        res.status(403).json({ error: error.message })
        return
    }
    next()
}

export function isManager( req: Request, res: Response, next: NextFunction ) {
    if( req.user.id.toString() !== req.project.manager.toString() ) {
        const error = new Error("Action not allowed")
        res.status(403).json({ error: error.message })
        return
    }
    next()
}