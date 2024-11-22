import mongoose, { Schema, Document, Types } from "mongoose";

const taskStatus = {
    PENDING: "Not Started",
    ON_HOLD: "onHold",
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
    }
}, {timestamps: true})

const Task = mongoose.model<TaskInterface>("Task", TaskSchema);

export default Task