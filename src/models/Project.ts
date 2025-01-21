import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import Task, { TaskInterface } from "./Task";
import { UserInterface } from "./User";
import Note from "./Note";

export interface ProjectInterface extends Document {
    projectName: string, 
    projectDescription: string,
    clientName: string, 
    tasks: PopulatedDoc<TaskInterface & Document>[], 
    manager: PopulatedDoc<UserInterface & Document>
    team: PopulatedDoc<UserInterface & Document>[]
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
    ], 
    manager: {
        type: Types.ObjectId,
        ref: "User"
    }, 
    team: [
        {
            type: Types.ObjectId, 
            ref: "User"
        }
    ]
}, {timestamps: true})

// Middleware to delete all notes related to a task
ProjectSchema.pre("deleteOne", { document: true, query: false }, async function() {
    const projectId = this._id
    if(!projectId) return
    
    const tasks = await Task.find({
        project: projectId
    })

    for(const task of tasks) {
        await Note.deleteMany({task: task._id})
    }

    await Task.deleteMany({project: projectId})
    //console.log(this)
})


const Project = mongoose.model<ProjectInterface>("Project", ProjectSchema);

export default Project;