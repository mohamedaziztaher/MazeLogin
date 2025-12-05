import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../models/User';
import { generateMazeHash, verifyPath, serializeMaze } from '../utils/mazeUtils';

const generateToken = (id: string | unknown) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, email, mazeConfig, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Process Maze
        // We expect mazeConfig to contain: gridSize, walls (array of points), start, exit, path
        const { gridSize, walls, start, exit, path } = mazeConfig;

        // Generate Salt
        const salt = crypto.randomBytes(16).toString('hex');

        // Serialize Walls (if they came as array of points)
        // If the client sends them already serialized, we use that.
        // Let's assume client sends array of points {x, y} for simplicity in this demo,
        // or we can handle both. Let's enforce array of points for clarity.
        let serializedWalls = '';
        if (Array.isArray(walls)) {
            serializedWalls = serializeMaze(walls, gridSize);
        } else {
            serializedWalls = walls; // Assume already serialized
        }

        // Generate Hash
        const mazeHash = generateMazeHash(serializedWalls, start, exit, salt);

        // Password Fallback (Optional)
        let passwordHash = undefined;
        if (password) {
            passwordHash = await bcrypt.hash(password, 10);
        }

        const user = await User.create({
            username,
            email,
            passwordHash,
            mazeHash,
            mazeConfig: {
                gridSize,
                walls: serializedWalls,
                start,
                exit,
                path: path || [], // Store the solution path for display
                salt
            }
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getMaze = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the maze config so the user can solve it
        // We do NOT return the hash or the salt (though salt is in config, maybe we should exclude it?)
        // The salt is needed if we were to re-hash client side, but we don't need to.
        // We just need the grid.

        const { gridSize, walls, start, exit, path } = user.mazeConfig;

        res.json({
            gridSize,
            walls,
            start,
            exit,
            path: path || [] // Include path for display on dashboard
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, path } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate Path
        // We need to reconstruct the walls from the serialized string
        // For this demo, we'll implement a deserializer or just use the verifyPath logic which expects points.
        // Since we stored serializedWalls, we need to deserialize it to check the path.
        // OR, we can just check if the path is valid against the stored config.

        // Deserialization logic (simple version matching the serialization)
        const walls: { x: number, y: number }[] = [];
        const buffer = Buffer.from(user.mazeConfig.walls, 'base64');
        const gridSize = user.mazeConfig.gridSize;

        for (let i = 0; i < gridSize * gridSize; i++) {
            const byteIndex = Math.floor(i / 8);
            const bitIndex = i % 8;
            if (buffer[byteIndex] & (1 << bitIndex)) {
                walls.push({
                    x: i % gridSize,
                    y: Math.floor(i / gridSize)
                });
            }
        }

        const isValid = verifyPath(path, walls, gridSize, user.mazeConfig.start, user.mazeConfig.exit);

        if (isValid) {
            res.json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid maze solution' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
