import { request, type Request, type Response } from "express";
import Project from "../models/Project";

export class ProjectController {

    // Get all projects
    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: {$in: req.user.id} }, // Projects where the user is the manager
                    {team: {$in: req.user.id}} // Projects where the user is a team member
                ]
            });
            res.status(200).json(projects);  // Respuesta con código 200 OK
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Get project by Id
    static getProjectById = async (req: Request, res: Response) => {
        
        try {
            const { id } = req.params
            const project = await Project.findById(id).populate("tasks");

            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id.toString())) {
                const error = new Error("Action not allowed");
                res.status(403).json({ error: error.message });
                return;
            }

            res.status(200).json(project);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Create a Project
    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body);
        // console.log(req.user)

        /** Add the manager to the project */
        project.manager = req.user.id

        try {
            await project.save();
            res.status(201).json({ message: "Project created successfully", project });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Update a Project by its Id
    static updateProject = async (req: Request, res: Response) => {
        
        try {
            const project = req.project

            project.projectName = req.body.projectName;
            project.projectDescription = req.body.projectDescription;
            project.clientName = req.body.clientName;

            await project.save();
            res.status(201).json({ message: "Project updated successfully", project });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        } 
    }

    // Delete a Project by its Id
    static deleteProject = async (req: Request, res: Response) => {

        try {
            const project = req.project;

            await project.deleteOne();
            res.status(200).json({ message: "Project deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        } 
    }
}