import { describe, it, expect } from 'vitest';
import { serializeMaze, generateMazeHash, verifyPath } from './utils/mazeUtils';

describe('Maze Utils', () => {
    const gridSize = 10;
    const start = { x: 0, y: 0 };
    const exit = { x: 9, y: 9 };
    const salt = 'test_salt';

    // Create a simple path: (0,0) -> (0,1) -> ... -> (0,9) -> (1,9) -> ... -> (9,9)
    // Just a simple L shape for testing
    const walls: { x: number; y: number }[] = []; // No walls for simplicity in this unit test

    it('should serialize maze correctly', () => {
        const serialized = serializeMaze(walls, gridSize);
        expect(serialized).toBeDefined();
        expect(typeof serialized).toBe('string');
    });

    it('should generate consistent hash', () => {
        const s1 = serializeMaze(walls, gridSize);
        const h1 = generateMazeHash(s1, start, exit, salt);
        const h2 = generateMazeHash(s1, start, exit, salt);
        expect(h1).toBe(h2);
    });

    it('should verify a valid path', () => {
        // Direct path from 0,0 to 0,1
        const simpleStart = { x: 0, y: 0 };
        const simpleExit = { x: 0, y: 1 };
        const path = [{ x: 0, y: 0 }, { x: 0, y: 1 }];

        const isValid = verifyPath(path, [], gridSize, simpleStart, simpleExit);
        expect(isValid).toBe(true);
    });

    it('should reject invalid path (teleportation)', () => {
        const simpleStart = { x: 0, y: 0 };
        const simpleExit = { x: 0, y: 2 };
        const path = [{ x: 0, y: 0 }, { x: 0, y: 2 }]; // Skipped 0,1

        const isValid = verifyPath(path, [], gridSize, simpleStart, simpleExit);
        expect(isValid).toBe(false);
    });

    it('should reject path hitting wall', () => {
        const simpleStart = { x: 0, y: 0 };
        const simpleExit = { x: 0, y: 2 };
        const testWalls = [{ x: 0, y: 1 }];
        const path = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }];

        const isValid = verifyPath(path, testWalls, gridSize, simpleStart, simpleExit);
        expect(isValid).toBe(false);
    });
});
