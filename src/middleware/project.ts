import type { Request, Response, NextFunction } from "express";
import Project, { ProjectInterface } from "../models/Project";

declare global {
    namespace Express {
        interface Request {
            project: ProjectInterface
        }
    }
}

export async function projectExists(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id || req.params.projectId; // Dynamically fetch the parameter

        if (!id) {
            return res.status(400).json({ error: "Project ID is missing" });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        req.project = project;

        next();
    } catch (error) {
        console.error("Error in projectExists middleware:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}