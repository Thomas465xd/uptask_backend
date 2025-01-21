import mongoose, { Schema, Document, Types } from "mongoose";
import Note from "./Note";

const taskStatus = {
    PENDING: "Not Started",
    ON_HOLD: "On Hold",
    IN_PROGRESS: "In Progress",
    UNDER_REVIEW: "Under Review", 
    COMPLETED: "Completed"
} as const

export type taskStatus = typeof taskStatus[keyof typeof taskStatus]

export interface TaskInterface extends Document {
    taskName: string;
    taskDescription: string; 
    project: Types.ObjectId;
    status: taskStatus;
    completedBy: {
        user: Types.ObjectId;
        status: taskStatus;
    }[];
    notes: Types.ObjectId[];
}

export const TaskSchema: Schema = new Schema({
    taskName: {
        type: String, 
        trim: true, 
        required: true
    }, 
    taskDescription: {
        type: String,
        trim: true, 
        required: true
    }, 
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    }, 
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    }, 
    completedBy: [
        {
            user: {
                type: Schema.Types.ObjectId, 
                ref: "User", 
                default: null
            }, 
            status: {
                type: String, 
                enum: Object.values(taskStatus), 
                default: taskStatus.PENDING
            }
        }
    ], 
    notes: [
        {
            type: Types.ObjectId, 
            ref: "Note",
        }
    ]
}, {timestamps: true})

// Middleware to delete all notes related to a task
TaskSchema.pre("deleteOne", { document: true, query: false }, async function() {
    const taskId = this._id
    if(!taskId) return
    
    await Note.deleteMany({task: taskId})
    //console.log(this)
})

const Task = mongoose.model<TaskInterface>("Task", TaskSchema);

export default Task