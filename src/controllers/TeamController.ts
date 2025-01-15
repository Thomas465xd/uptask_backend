import type { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';

export class TeamMemberController {

    // Get all project team members
    static getProjectTeam = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.params.projectId).populate({
                path: "team",
                select: "id name email"
            });

            res.json(project.team);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Get a team member by id
    static getTeamMemberById = async (req: Request, res: Response) => {
        try {
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Find a member by email
    static findMemberByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            // Find user
            const user = await User.findOne({ email }).select("id email name");

            if(!user) {
                const error = new Error("User not found");
                res.status(404).send({error: error.message});
                return;
            }

            res.json(user);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Add a member to the team
    static addMemberToTeam = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;

            // Find user
            const user = await User.findById( id ).select("id");

            if(!user) {
                const error = new Error("User not found");
                res.status(404).send({error: error.message});
                return;
            }

            // Check if the user is already in the team
            if(req.project.team.some(member => member.toString() === user.id.toString())) { 
                const error = new Error("User is already in the team");
                res.status(409).send({error: error.message});
                return;
            }

            req.project.team.push(user.id);
            await req.project.save();

            res.status(201).json({ message: "User added to team successfully" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Remove a member from the team
    static removeMemberFromTeam = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;

            // Check if the user is already in the team
            if(!req.project.team.some(member => member.toString() === userId.toString())) { 
                const error = new Error("User does not exist in the project");
                res.status(409).send({error: error.message});
                return;
            }

            req.project.team = req.project.team.filter( teamMember => teamMember.toString() !== userId.toString() );
    
            await req.project.save();
            
            res.status(200).json({ message: "User removed from team successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        } 
    }
}