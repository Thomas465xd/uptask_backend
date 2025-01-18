import type { Request, Response } from "express";
import Note, { NoteInterface } from "../models/Note";

export class NoteController {
    static createNote = async (req: Request<{}, {}, NoteInterface>, res: Response) => {
        try {
            const { content } = req.body
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}