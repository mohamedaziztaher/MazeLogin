import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { generateMazeHash, serializeMaze } from '../utils/mazeUtils';
import crypto from 'crypto';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mazeid');
        console.log('MongoDB Connected');

        await User.deleteMany({});
        console.log('Cleared existing users');

        const gridSize = 10;
        const start = { x: 0, y: 0 };
        const exit = { x: 9, y: 9 };
        const salt = crypto.randomBytes(16).toString('hex');

        // Create a simple path for the demo maze
        // Let's make a simple snake path or just a direct diagonal-ish path if no walls
        // For demo, let's add some walls to make it interesting but solvable
        // Walls at (1,0), (1,1), (1,2) blocking immediate right
        const walls = [
            { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 },
            { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 }
        ];

        const serializedWalls = serializeMaze(walls, gridSize);
        const mazeHash = generateMazeHash(serializedWalls, start, exit, salt);

        await User.create({
            username: 'demo_user',
            email: 'demo@example.com',
            mazeHash,
            mazeConfig: {
                gridSize,
                walls: serializedWalls,
                start,
                exit,
                salt
            }
        });

        console.log('Demo user created: username="demo_user"');
        console.log('Maze created with 10x10 grid');

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
