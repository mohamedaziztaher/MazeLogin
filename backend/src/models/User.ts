import mongoose, { Document, Schema } from 'mongoose';

export interface IMazeConfig {
    gridSize: number;
    walls: string; // Serialized representation (e.g., base64 or RLE)
    start: { x: number; y: number };
    exit: { x: number; y: number };
    path?: { x: number; y: number }[]; // Solution path for display
    salt: string; // Salt for the maze hash
}

export interface IUser extends Document {
    username: string;
    email?: string;
    passwordHash?: string; // Fallback auth
    mazeHash: string; // The secure "password" derived from the maze
    mazeConfig: IMazeConfig; // For rendering the maze to the user (obfuscated if needed, but here stored for retrieval)
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String },
    mazeHash: { type: String, required: true },
    mazeConfig: {
        gridSize: { type: Number, required: true },
        walls: { type: String, required: true },
        start: {
            x: { type: Number, required: true },
            y: { type: Number, required: true }
        },
        exit: {
            x: { type: Number, required: true },
            y: { type: Number, required: true }
        },
        path: [{
            x: { type: Number },
            y: { type: Number }
        }],
        salt: { type: String, required: true }
    },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
