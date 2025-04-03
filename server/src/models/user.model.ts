import { Schema, model, Document } from "mongoose";
import { Project } from "./project.model";


interface IUser extends Document {
    username: string,
    email: string,
    password?: string,
    githubId?: string;
    avatarUrl?: string;
    projects: typeof Project[],
    createdAt: Date,
    updatedAt: Date,
}


const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    githubId: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})


export const User = model<IUser>("User", UserSchema);