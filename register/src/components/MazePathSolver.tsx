import React, { useState, useEffect, useCallback } from 'react';

interface Point {
    x: number;
    y: number;
}

interface MazePathSolverProps {
    gridSize: number;
    walls: string; // base64 encoded
    start: Point;
    exit: Point;
    onSolve: (path: Point[]) => void;
}

// Helper function to check if a cell is on the edge
const isOnEdge = (x: number, y: number, gridSize: number): boolean => {
    return x === 0 || x === gridSize - 1 || y === 0 || y === gridSize - 1;
};

// Deserialize walls from base64
const deserializeWalls = (wallsString: string, gridSize: number): Set<string> => {
    const walls = new Set<string>();
    try {
        const buffer = atob(wallsString);
        for (let i = 0; i < gridSize * gridSize; i++) {
            const byteIndex = Math.floor(i / 8);
            const bitIndex = i % 8;
            const charCode = buffer.charCodeAt(byteIndex);
            if (charCode & (1 << bitIndex)) {
                const x = i % gridSize;
                const y = Math.floor(i / gridSize);
                walls.add(`${x},${y}`);
            }
        }
    } catch (error) {
        console.error('Error deserializing walls:', error);
    }
    return walls;
};

const MazePathSolver: React.FC<MazePathSolverProps> = ({ gridSize, walls, start, exit, onSolve }) => {
    const [path, setPath] = useState<Point[]>([]);
    const [wallSet, setWallSet] = useState<Set<string>>(new Set());
    const [isDrawing, setIsDrawing] = useState(false);
    const [pathComplete, setPathComplete] = useState(false);

    // Deserialize walls on mount
    useEffect(() => {
        const deserializedWalls = deserializeWalls(walls, gridSize);
        setWallSet(deserializedWalls);
    }, [walls, gridSize]);

    // Reset path when start/exit changes
    useEffect(() => {
        setPath([]);
        setPathComplete(false);
    }, [start, exit]);

    const addToPath = useCallback((x: number, y: number) => {
        const point: Point = { x, y };
        const key = `${x},${y}`;

        // Don't allow clicking on walls
        if (wallSet.has(key)) {
            console.log(`Cannot add to path: Position (${x}, ${y}) is a wall`);
            return;
        }

        setPath(prevPath => {
            // If path is empty, can start anywhere (no hint about start position)
            if (prevPath.length === 0) {
                console.log(`Path started at position (${x}, ${y})`);
                return [point];
            }

            // Path must be a connected chain - check if adjacent to last point
            const last = prevPath[prevPath.length - 1];
            const dx = Math.abs(x - last.x);
            const dy = Math.abs(y - last.y);

            // Only allow adjacent cells (up, down, left, right)
            if (dx + dy === 1) {
                const newPath = [...prevPath, point];
                
                // Check if we reached the exit (no visual hint, but validate silently)
                if (x === exit.x && y === exit.y) {
                    console.log(`Path completed! Reached exit at (${x}, ${y})`);
                    setPathComplete(true);
                    // Auto-submit after a short delay to show the completion
                    setTimeout(() => {
                        onSolve(newPath);
                    }, 300);
                }
                
                console.log(`Added to path: Position (${x}, ${y}) - Path length: ${newPath.length}`);
                return newPath;
            }

            console.log(`Cannot add to path: Position (${x}, ${y}) is not adjacent to last path point (${last.x}, ${last.y})`);
            return prevPath;
        });
    }, [start, exit, wallSet, onSolve]);

    const handleCellClick = (x: number, y: number) => {
        if (pathComplete) return; // Don't allow changes after path is complete
        
        const isOnPath = path.some(p => p.x === x && p.y === y);
        
        // Toggle behavior: if cell is on path, remove it; otherwise, add it
        if (isOnPath) {
            // Remove this cell and everything after it
            setPath(prevPath => {
                const index = prevPath.findIndex(p => p.x === x && p.y === y);
                if (index !== -1) {
                    const newPath = prevPath.slice(0, index);
                    console.log(`Removed cell (${x}, ${y}) and everything after. Path length: ${prevPath.length} -> ${newPath.length}`);
                    return newPath;
                }
                return prevPath;
            });
        } else {
            // Add cell to path
            addToPath(x, y);
        }
    };

    const handleCellMouseEnter = (x: number, y: number) => {
        if (isDrawing && !pathComplete) {
            addToPath(x, y);
        }
    };

    const handleClear = () => {
        setPath([]);
        setPathComplete(false);
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <div className="w-full flex justify-center">
                <div
                    className="grid gap-0.5 bg-white p-2 rounded-lg shadow-xl border-2 border-gray-200"
                    style={{
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        width: 'fit-content',
                        maxWidth: '100%'
                    }}
                >
                    {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                        const x = i % gridSize;
                        const y = Math.floor(i / gridSize);
                        const key = `${x},${y}`;
                        const isWall = wallSet.has(key);
                        const isStart = x === start.x && y === start.y;
                        const isExit = x === exit.x && y === exit.y;
                        const isOnPath = path.some(p => p.x === x && p.y === y);
                        const isPathEnd = path.length > 0 && path[path.length - 1].x === x && path[path.length - 1].y === y;

                        // Determine cell appearance with proper priority
                        let cellClass = "cursor-pointer transition-all duration-150 hover:scale-110 select-none touch-none";
                        let cellStyle: React.CSSProperties = {
                            width: '32px',
                            height: '32px',
                            minWidth: '32px',
                            minHeight: '32px'
                        };

                        // Priority: Path > Walls > Empty (no hints for start/exit)
                        if (isOnPath) {
                            cellStyle.backgroundColor = '#FBBF24'; // yellow-400 for path
                            cellStyle.border = '1px solid #F59E0B'; // yellow-600 border
                            cellStyle.boxShadow = isPathEnd 
                                ? '0 0 0 2px rgba(245, 158, 11, 0.5)' 
                                : '0 0 0 1px rgba(245, 158, 11, 0.3)';
                        } else if (isWall) {
                            cellStyle.backgroundColor = '#000000'; // black
                            cellStyle.border = '1px solid #1F2937';
                            cellClass = "cursor-not-allowed";
                        } else {
                            // Start and exit look like empty cells (no hints)
                            cellStyle.backgroundColor = '#FFFFFF'; // white
                            cellStyle.border = '1px solid #E5E7EB'; // gray-200
                        }

                        return (
                            <div
                                key={i}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCellClick(x, y);
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    if (!pathComplete) {
                                        setIsDrawing(true);
                                    }
                                }}
                                onMouseUp={() => {
                                    setIsDrawing(false);
                                }}
                                onMouseEnter={() => {
                                    handleCellMouseEnter(x, y);
                                }}
                                className={cellClass}
                                style={cellStyle}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleCellClick(x, y);
                                    }
                                }}
                                aria-label={`Cell ${x},${y} ${isWall ? 'Wall' : 'Empty'} ${isStart ? 'Start' : ''} ${isExit ? 'Exit' : ''} ${isOnPath ? 'Path' : ''}`}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleClear}
                    disabled={pathComplete}
                    className="px-5 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        background: pathComplete ? '#9CA3AF' : '#6B7280',
                        color: '#FFFFFF',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                >
                    Clear Path
                </button>
            </div>

            <div className="text-center text-sm text-gray-600">
                <p className="font-medium mb-2">
                    <span style={{ color: '#FBBF24' }}>● Yellow</span> = Your Path •
                    <span style={{ color: '#000000' }}> ■ Black</span> = Walls
                </p>
                {path.length === 0 && (
                    <p className="text-blue-600 font-semibold mt-2">
                        👆 Click a cell to start drawing your path
                    </p>
                )}
                {path.length > 0 && !pathComplete && (
                    <p className="text-yellow-600 font-semibold mt-2">
                        🎨 Drawing path... Click adjacent cells to continue
                    </p>
                )}
                {pathComplete && (
                    <p className="text-green-600 font-semibold mt-2">
                        ✓ Path complete! Authenticating...
                    </p>
                )}
            </div>
        </div>
    );
};

export default MazePathSolver;

