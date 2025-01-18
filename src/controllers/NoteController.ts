import type { Request, Response } from "express";
import Note, { NoteInterface } from "../models/Note";
import { Types } from "mongoose";


type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, NoteInterface>, res: Response) => {
        try {
            const { content } = req.body

            const note = new Note()

            note.content = content
            note.createdBy = req.user.id
            note.task = req.task.id

            req.task.notes.push(note.id)

            await Promise.allSettled([req.task.save(), note.save()])

            res.status(200).json({message: "Note Created Succesfully", note})
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static getTaskNote = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({task: req.task.id})
            res.status(200).json(notes)
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static deleteNote = async ( req: Request<NoteParams>, res: Response ) => {
        try {
            const { noteId } = req.params
            const note = await Note.findById(noteId)

            if(!note) {
                const error = new Error("Note not found")
                res.status(404).json({error: error.message})
                return
            }

            if(note.createdBy.toString() !== req.user.id.toString()) {
                const error = new Error("Action Not Allowed")
                res.status(401).json({error: error.message})
                return
            }

            req.task.notes = req.task.notes.filter( note => note.toString() != noteId.toString())

            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.status(200).json({message: "Note Deleted Successfully"})
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}