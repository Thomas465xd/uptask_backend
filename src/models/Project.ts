import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { TaskInterface } from "./Task";

export interface ProjectInterface extends Document {
    projectName: string, 
    projectDescription: string,
    clientName: string, 
    tasks: PopulatedDoc<TaskInterface & Document>[]
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true, 
        trim: true
    },
    projectDescription: {
        type: String,
        required: true, 
        trim: true
    },
    clientName: {
        type: String,
        required: true, 
        trim: true
    }, 
    tasks: [
        {
            type: Types.ObjectId, 
            ref: "Task"
        }
    ]
}, {timestamps: true})

const Project = mongoose.model<ProjectInterface>("Project", ProjectSchema);

export default Project;