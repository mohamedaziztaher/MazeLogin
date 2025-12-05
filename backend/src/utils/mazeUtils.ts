import crypto from 'crypto';

interface Point {
    x: number;
    y: number;
}

export const serializeMaze = (walls: Point[], gridSize: number): string => {
    // Simple serialization: Create a bitmask and base64 encode it
    // This is a naive implementation for demonstration. 
    // For a 15x15 grid, we have 225 cells. 
    // We can represent this as a binary string where 1 is wall, 0 is empty.

    const totalCells = gridSize * gridSize;
    const bufferSize = Math.ceil(totalCells / 8);
    const buffer = Buffer.alloc(bufferSize);

    walls.forEach(wall => {
        const index = wall.y * gridSize + wall.x;
        const byteIndex = Math.floor(index / 8);
        const bitIndex = index % 8;
        buffer[byteIndex] |= (1 << bitIndex);
    });

    return buffer.toString('base64');
};

export const generateMazeHash = (serializedWalls: string, start: Point, exit: Point, salt: string): string => {
    const data = `${serializedWalls}:${start.x},${start.y}:${exit.x},${exit.y}:${salt}`;
    return crypto.createHash('sha256').update(data).digest('hex');
};

export const verifyPath = (path: Point[], walls: Point[], gridSize: number, start: Point, exit: Point): boolean => {
    // 1. Check start and end
    if (path.length === 0) return false;
    const first = path[0];
    const last = path[path.length - 1];

    if (first.x !== start.x || first.y !== start.y) return false;
    if (last.x !== exit.x || last.y !== exit.y) return false;

    // 2. Check continuity and collisions
    const wallSet = new Set(walls.map(w => `${w.x},${w.y}`));

    for (let i = 0; i < path.length; i++) {
        const curr = path[i];

        // Bounds check
        if (curr.x < 0 || curr.x >= gridSize || curr.y < 0 || curr.y >= gridSize) return false;

        // Wall check
        if (wallSet.has(`${curr.x},${curr.y}`)) return false;

        // Continuity check (except for first point)
        if (i > 0) {
            const prev = path[i - 1];
            const dx = Math.abs(curr.x - prev.x);
            const dy = Math.abs(curr.y - prev.y);
            if (dx + dy !== 1) return false; // Must move exactly 1 step horizontally or vertically
        }
    }

    return true;
};
