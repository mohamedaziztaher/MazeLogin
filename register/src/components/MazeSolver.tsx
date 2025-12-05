import React, { useState, useEffect, useCallback } from 'react';

interface Point {
    x: number;
    y: number;
}

interface MazeSolverProps {
    gridSize: number;
    walls: string; // Serialized base64
    start: Point;
    exit: Point;
    onSolve: (path: Point[]) => void;
}

const MazeSolver: React.FC<MazeSolverProps> = ({ gridSize, walls, start, exit, onSolve }) => {
    const [currentPos, setCurrentPos] = useState<Point>(start);
    const [path, setPath] = useState<Point[]>([start]);
    const [wallSet, setWallSet] = useState<Set<string>>(new Set());

    // Deserialize walls on mount
    useEffect(() => {
        const newWallSet = new Set<string>();
        const buffer = atob(walls); // Decode base64
        // This assumes the browser's atob works with the server's base64. 
        // Node's Buffer base64 might need careful handling if binary data.
        // Actually, the server sends a base64 string of a binary buffer.
        // In browser, atob returns a binary string.

        for (let i = 0; i < gridSize * gridSize; i++) {
            const byteIndex = Math.floor(i / 8);
            const bitIndex = i % 8;
            const charCode = buffer.charCodeAt(byteIndex);
            if (charCode & (1 << bitIndex)) {
                const x = i % gridSize;
                const y = Math.floor(i / gridSize);
                newWallSet.add(`${x},${y}`);
            }
        }
        setWallSet(newWallSet);
    }, [walls, gridSize]);

    const handleMove = useCallback((dx: number, dy: number) => {
        setCurrentPos(prev => {
            const newX = prev.x + dx;
            const newY = prev.y + dy;

            // Bounds check
            if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) return prev;

            // Wall check
            if (wallSet.has(`${newX},${newY}`)) return prev;

            // Update path
            const newPos = { x: newX, y: newY };
            setPath(prevPath => [...prevPath, newPos]);

            // Check exit
            if (newX === exit.x && newY === exit.y) {
                // We need to pass the updated path including the exit
                // But state update is async, so we construct it here
                onSolve([...path, newPos]);
            }

            return newPos;
        });
    }, [gridSize, wallSet, exit, onSolve, path]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': handleMove(0, -1); break;
                case 'ArrowDown': handleMove(0, 1); break;
                case 'ArrowLeft': handleMove(-1, 0); break;
                case 'ArrowRight': handleMove(1, 0); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove]);

    return (
        <div className="flex flex-col items-center gap-6 p-6 outline-none" tabIndex={0}>
            <div
                className="grid gap-0.5 bg-white p-2 rounded-lg shadow-xl border-2 border-gray-200 relative"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
                {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                    const x = i % gridSize;
                    const y = Math.floor(i / gridSize);
                    const key = `${x},${y}`;
                    const isWall = wallSet.has(key);
                    const isStart = x === start.x && y === start.y;
                    const isExit = x === exit.x && y === exit.y;
                    const isPlayer = x === currentPos.x && y === currentPos.y;
                    const isPath = path.some(p => p.x === x && p.y === y);

                    // Determine cell appearance
                    let cellClass = "aspect-square transition-all duration-150";
                    if (isWall) {
                        cellClass += " bg-black";
                    } else if (isPlayer) {
                        // Player position takes priority - show blue
                        cellClass += " bg-blue-500 ring-2 ring-blue-300 scale-105 z-10";
                    } else if (isPath) {
                        // Red path for solution (matching the second image)
                        if (isStart) {
                            cellClass += " bg-green-500 ring-2 ring-green-600";
                        } else if (isExit) {
                            cellClass += " bg-red-600 ring-2 ring-red-700";
                        } else {
                            cellClass += " bg-red-500";
                        }
                    } else if (isStart) {
                        // Start position when not yet visited
                        cellClass += " bg-green-400 ring-2 ring-green-500";
                    } else if (isExit) {
                        // Exit position when not yet reached
                        cellClass += " bg-red-600 ring-2 ring-red-700";
                    } else {
                        cellClass += " bg-white";
                    }

                    return (
                        <div
                            key={i}
                            className={cellClass}
                            style={{ minWidth: '24px', minHeight: '24px' }}
                            role="gridcell"
                            aria-label={`Cell ${x},${y} ${isWall ? 'Wall' : 'Empty'} ${isStart ? 'Start' : ''} ${isExit ? 'Exit' : ''} ${isPath ? 'Path' : ''}`}
                        />
                    );
                })}
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-gray-700">
                    Use <span className="font-bold text-nird-blue">Arrow Keys</span> to navigate from <span className="text-green-600 font-semibold">Start</span> to <span className="text-red-600 font-semibold">Exit</span>
                </p>
                <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-black rounded"></div>
                        Wall
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        Path
                    </span>
                    <span className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        You
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MazeSolver;
