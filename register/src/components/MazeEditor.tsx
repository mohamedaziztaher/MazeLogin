import React, { useState, useEffect, useCallback } from 'react';

interface Point {
    x: number;
    y: number;
}

interface MazeEditorProps {
    onSave: (config: { gridSize: number; walls: Point[]; start: Point; exit: Point; path: Point[] }) => void;
}

// Helper function to check if a point is on the edge
const isOnEdge = (x: number, y: number, gridSize: number): boolean => {
    return x === 0 || x === gridSize - 1 || y === 0 || y === gridSize - 1;
};

const MazeEditor: React.FC<MazeEditorProps> = ({ onSave }) => {
    const [gridSize, setGridSize] = useState<number>(10);
    const [path, setPath] = useState<Point[]>([]);
    const [walls, setWalls] = useState<Set<string>>(new Set());
    const [start, setStart] = useState<Point | null>(null);
    const [exit, setExit] = useState<Point | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [pathEnded, setPathEnded] = useState(false);

    useEffect(() => {
        // Reset when grid size changes
        setWalls(new Set());
        setPath([]);
        setStart(null);
        setExit(null);
        setPathEnded(false);
    }, [gridSize]);

    // Update exit when path changes - exit is always the last path cell
    useEffect(() => {
        if (path.length > 0) {
            const lastPoint = path[path.length - 1];
            if (isOnEdge(lastPoint.x, lastPoint.y, gridSize)) {
                setExit(lastPoint);
            } else {
                setExit(null);
            }
        } else {
            setExit(null);
        }
    }, [path, gridSize]);


    const addToPath = useCallback((x: number, y: number) => {
        if (!start) {
            console.log(`Cannot draw path: Start position not set yet`);
            return;
        }

        const key = `${x},${y}`;
        const point = { x, y };

        // Don't allow path on start position
        if (key === `${start.x},${start.y}`) {
            console.log(`Cannot add to path: Position (${x}, ${y}) is Start`);
            return;
        }

        setPath(prevPath => {
            // If clicking on an existing path point, backtrack to that point (keep it in path)
            const index = prevPath.findIndex(p => p.x === x && p.y === y);
            if (index !== -1) {
                // Keep the clicked cell in the path (index + 1), remove everything after it
                const newPath = prevPath.slice(0, index + 1);
                console.log(`Backtracking to position (${x}, ${y}). Path length: ${prevPath.length} -> ${newPath.length}`);
                return newPath;
            }

            // If path is empty, must start adjacent to start
            if (prevPath.length === 0) {
                const dx = Math.abs(x - start.x);
                const dy = Math.abs(y - start.y);
                if (dx + dy === 1) {
                    console.log(`Path started at position (${x}, ${y}) - adjacent to Start (${start.x}, ${start.y})`);
                    return [point];
                }
                console.log(`Cannot start path: Position (${x}, ${y}) is not adjacent to Start (${start.x}, ${start.y})`);
                return prevPath;
            }

            // Path must be a connected chain
            const last = prevPath[prevPath.length - 1];
            const dx = Math.abs(x - last.x);
            const dy = Math.abs(y - last.y);

            // Only allow adjacent cells (up, down, left, right)
            if (dx + dy === 1) {
                console.log(`Added to path: Position (${x}, ${y}) - Path length: ${prevPath.length + 1}`);
                return [...prevPath, point];
            }

            console.log(`Cannot add to path: Position (${x}, ${y}) is not adjacent to last path point (${last.x}, ${last.y})`);
            return prevPath;
        });
    }, [start]);

    const handleCellClick = (x: number, y: number) => {
        const key = `${x},${y}`;
        const isWall = walls.has(key);
        const isOnPath = path.some(p => p.x === x && p.y === y);
        const isStart = start && x === start.x && y === start.y;
        const isExit = exit && x === exit.x && y === exit.y;
        const isEdge = isOnEdge(x, y, gridSize);

        // Don't allow clicking on walls
        if (isWall) {
            console.log(`Cannot click on wall: Position (${x}, ${y})`);
            return;
        }

        console.log(`Cell clicked: Position (${x}, ${y}) | isStart=${isStart}, isOnPath=${isOnPath}, isEdge=${isEdge}`);

        // Toggle behavior: if cell is colored, remove it; otherwise, add it
        if (isStart) {
            // Clicking start removes it
            setStart(null);
            setPath([]); // Clear path when start is removed
            setExit(null);
            console.log(`Removed start at (${x}, ${y})`);
            return;
        }

        if (isOnPath) {
            // Clicking path cell removes it and everything after it
            setPath(prevPath => {
                const index = prevPath.findIndex(p => p.x === x && p.y === y);
                if (index !== -1) {
                    const newPath = prevPath.slice(0, index);
                    console.log(`Removed cell (${x}, ${y}) and everything after. Path length: ${prevPath.length} -> ${newPath.length}`);
                    // Update exit if needed
                    if (newPath.length > 0) {
                        const lastPoint = newPath[newPath.length - 1];
                        if (isOnEdge(lastPoint.x, lastPoint.y, gridSize)) {
                            setExit(lastPoint);
                        } else {
                            setExit(null);
                        }
                    } else {
                        setExit(null);
                    }
                    return newPath;
                }
                return prevPath;
            });
            return;
        }

        // Cell is white - add it
        if (!start) {
            // No start set yet - if on edge, set as start (green); otherwise ignore
            if (isEdge) {
                setStart({ x, y });
                console.log(`Start position set to: (${x}, ${y}) - Green`);
            } else {
                console.log(`Cannot set start: Position (${x}, ${y}) is not on edge`);
            }
            return;
        }

        // Start is set - add to path (red)
        if (!pathEnded) {
            addToPath(x, y);
        }
    };

    const handleCellMouseEnter = (x: number, y: number) => {
        if (start && isDrawing && !pathEnded) {
            addToPath(x, y);
        }
    };

    const handleSave = () => {
        if (!start) {
            alert('Please set the start position first! Click a cell on the edge.');
            return;
        }

        if (path.length === 0) {
            alert('Please draw a path! Click adjacent cells starting from the start position.');
            return;
        }

        // If path ended but exit not set, use the last path point as exit
        let finalExit = exit;
        if (!finalExit && path.length > 0) {
            const lastPoint = path[path.length - 1];
            finalExit = lastPoint;
            setExit(finalExit);
        }

        if (!finalExit) {
            alert('The path must have an end point!');
            return;
        }

        // Verify path starts adjacent to start
        const firstPathPoint = path[0];
        const startAdjacent = Math.abs(firstPathPoint.x - start.x) + Math.abs(firstPathPoint.y - start.y) === 1;
        if (!startAdjacent) {
            alert('Error: Path must start adjacent to the Start position!');
            return;
        }

        // Verify path ends at exit (which is the last path point)
        const lastPathPoint = path[path.length - 1];
        if (lastPathPoint.x !== finalExit.x || lastPathPoint.y !== finalExit.y) {
            // Use the last path point as exit if they don't match
            finalExit = lastPathPoint;
            setExit(finalExit);
        }

        // Generate walls automatically before saving
        const pathSet = new Set(path.map(p => `${p.x},${p.y}`));
        const startKey = `${start.x},${start.y}`;
        const exitKey = `${finalExit.x},${finalExit.y}`;
        const newWalls = new Set<string>();
        
        // Generate walls randomly, but never on the path, start, or exit
        const wallProbability = 0.4; // 40% chance for each cell to be a wall
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const key = `${x},${y}`;
                
                // Never place walls on path, start, or exit
                if (pathSet.has(key) || key === startKey || key === exitKey) {
                    continue;
                }
                
                // Randomly decide if this cell should be a wall
                if (Math.random() < wallProbability) {
                    newWalls.add(key);
                }
            }
        }
        
        console.log(`Generated ${newWalls.size} walls automatically`);

        // Create full path including start and exit (avoid duplicates)
        const fullPath: Point[] = [start];
        
        // Add path points, avoiding duplicates with start
        path.forEach(p => {
            if (!(p.x === start.x && p.y === start.y)) {
                fullPath.push(p);
            }
        });
        
        // Add exit if not already in path
        if (!path.some(p => p.x === finalExit.x && p.y === finalExit.y)) {
            fullPath.push(finalExit);
        }
        
        console.log(`Saving maze: Start (${start.x}, ${start.y}), Exit (${finalExit.x}, ${finalExit.y}), Path length: ${fullPath.length}, Walls: ${newWalls.size}`);

        const wallsArray: Point[] = [];
        newWalls.forEach(w => {
            const [x, y] = w.split(',').map(Number);
            wallsArray.push({ x, y });
        });
        onSave({ gridSize, walls: wallsArray, start, exit: finalExit, path: fullPath });
    };

    return (
        <div className="flex flex-col items-center gap-6 p-4">
            <div className="flex flex-wrap gap-3 mb-4 w-full justify-center items-center">
                <select
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                    className="px-5 py-3 rounded-xl border-2 font-semibold transition-all duration-300 text-gray-800"
                    style={{
                        borderColor: '#E5E7EB',
                        background: '#FFFFFF',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#2563EB';
                        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#E5E7EB';
                        e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                    }}
                >
                    <option value={10}>10x10 Grid</option>
                    <option value={12}>12x12 Grid</option>
                    <option value={15}>15x15 Grid</option>
                </select>
                <button
                    onClick={() => {
                        setPath([]);
                        setWalls(new Set());
                        setStart(null);
                        setExit(null);
                        setPathEnded(false);
                    }}
                    className="px-5 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    style={{
                        background: '#6B7280',
                        color: '#FFFFFF',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                >
                    Reset
                </button>
            </div>

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
                        const isWall = walls.has(key);
                        const isStart = start && x === start.x && y === start.y;
                        const isExit = exit && x === exit.x && y === exit.y;
                        const isOnPath = path.some(p => p.x === x && p.y === y);
                        const isEdge = isOnEdge(x, y, gridSize);

                        // Determine cell appearance with proper priority
                        let cellClass = "cursor-pointer transition-all duration-150 hover:scale-110 select-none touch-none";
                        let cellStyle: React.CSSProperties = {
                            width: '32px',
                            height: '32px',
                            minWidth: '32px',
                            minHeight: '32px'
                        };

                        // Priority: Start > Exit > Path > Walls > Empty
                        // Use inline styles to ensure colors are always visible
                        if (isStart) {
                            cellStyle.backgroundColor = '#10B981'; // green-500
                            cellStyle.border = '2px solid #059669'; // green-600
                            cellStyle.boxShadow = '0 0 0 2px rgba(5, 150, 105, 0.3)';
                        } else if (isExit) {
                            cellStyle.backgroundColor = '#EF4444'; // red-500
                            cellStyle.border = '2px solid #DC2626'; // red-600
                            cellStyle.boxShadow = '0 0 0 2px rgba(220, 38, 38, 0.3)';
                        } else if (isOnPath) {
                            cellStyle.backgroundColor = '#EF4444'; // red-500 for path
                            cellStyle.border = '1px solid #DC2626'; // red-700 border
                            cellStyle.boxShadow = '0 0 0 1px rgba(220, 38, 38, 0.3)';
                        } else if (isWall) {
                            cellStyle.backgroundColor = '#000000'; // black
                            cellStyle.border = '1px solid #1F2937';
                        } else {
                            // Highlight edge cells when start is not set
                            if (!start && isEdge) {
                                cellStyle.backgroundColor = '#DBEAFE'; // blue-50
                                cellStyle.border = '2px solid #93C5FD'; // blue-300
                            } else {
                                cellStyle.backgroundColor = '#FFFFFF'; // white
                                cellStyle.border = '1px solid #E5E7EB'; // gray-200
                            }
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
                                    if (start) {
                                        setIsDrawing(true);
                                    }
                                }}
                                onMouseUp={() => {
                                    setIsDrawing(false);
                                }}
                                onMouseEnter={() => {
                                    handleCellMouseEnter(x, y);
                                }}
                                onMouseLeave={() => {
                                    // Optional: handle mouse leave
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

            <button
                onClick={handleSave}
                className="mt-4 px-8 py-4 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                style={{
                    background: (start && path.length > 0 && (exit || pathEnded)) 
                        ? 'linear-gradient(135deg, #2563EB, #9333EA)' 
                        : 'linear-gradient(135deg, #9CA3AF, #6B7280)',
                    opacity: (start && path.length > 0 && (exit || pathEnded)) ? 1 : 0.6,
                    cursor: (start && path.length > 0 && (exit || pathEnded)) ? 'pointer' : 'not-allowed'
                }}
                disabled={!start || path.length === 0 || (!exit && !pathEnded)}
                onMouseEnter={(e) => {
                    if (start && path.length > 0 && (exit || pathEnded)) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #9333EA, #EC4899)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (start && path.length > 0 && (exit || pathEnded)) {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #2563EB, #9333EA)';
                    }
                }}
            >
                Create Maze
            </button>

        </div>
    );
};

export default MazeEditor;
