import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MazeEditor from '../components/MazeEditor'
import { register } from '../services/api';

interface Point {
  x: number;
  y: number;
}

interface MazeConfig {
  gridSize: number;
  walls: Point[];
  start: Point;
  exit: Point;
  path: Point[];
}

const Register = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [registeredMaze, setRegisteredMaze] = useState<MazeConfig | null>(null);
  const navigate = useNavigate();

  // Auto-navigate to login after 5 seconds when credentials are shown
  useEffect(() => {
    if (showCredentials) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showCredentials, navigate]);

  const handleSaveMaze = async (mazeConfig: MazeConfig) => {
    if (!username) {
      setError('Username is required');
      return;
    }
    try {
      const response = await register(username, mazeConfig);
      localStorage.setItem('username', username);
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      // Store maze config and show credentials popup
      setRegisteredMaze(mazeConfig);
      setShowCredentials(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden relative z-10">
        <div className="flex min-h-[600px]">
          {/* Left Section - Artwork */}
          <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-orange-900 via-red-900 to-purple-900 relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-end z-10">
              <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                Sign In
              </Link>
            </div>

            {/* Artwork Background */}
            <div
              className="flex-1 relative overflow-hidden"
              style={{
                backgroundImage: 'url(/images/bakground.png)',
                backgroundSize: 'contain',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'local'
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"></div>
            </div>
          </div>

          {/* Right Section - Register Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-y-auto">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-500">Design your unique maze pattern to get started.</p>
              </div>

              <div className="space-y-6">
                {/* Username Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-nird-blue focus:ring-4 focus:ring-nird-blue/10 transition-all outline-none bg-gray-50 text-gray-900"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Maze Editor Section */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium text-gray-700">Security Pattern</label>
                    <button
                      onClick={() => setShowInstructions(true)}
                      className="w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center transition-colors"
                      aria-label="Show instructions"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-1 rounded-2xl bg-gradient-to-br from-nird-blue via-nird-purple to-nird-pink">
                    <div className="bg-white rounded-xl overflow-hidden">
                      <MazeEditor onSave={handleSaveMaze} />
                    </div>
                  </div>
                </div>

                {/* Instructions Modal */}
                {showInstructions && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowInstructions(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Simple Instructions</h3>
                        <button
                          onClick={() => setShowInstructions(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Close"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li><strong>Click an edge cell</strong> to set Start (green)</li>
                        <li><strong>Click adjacent cells</strong> to draw your path (red)</li>
                        <li><strong>End on an edge</strong> - Last cell becomes Exit (red)</li>
                        <li><strong>Click "Create Maze"</strong> - Walls will be generated automatically!</li>
                      </ol>
                      <button
                        onClick={() => setShowInstructions(false)}
                        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Got it!
                      </button>
                    </div>
                  </div>
                )}

                {/* Credentials Modal */}
                {showCredentials && registeredMaze && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Registration Successful!</h3>
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-4 mb-6">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Username:</p>
                          <p className="text-lg font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{username}</p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Your Maze:</p>
                          <div className="bg-gray-50 p-3 rounded-lg flex justify-center">
                            <div
                              className="grid gap-0.5 bg-white p-2 rounded-lg border border-gray-200"
                              style={{
                                gridTemplateColumns: `repeat(${registeredMaze.gridSize}, 1fr)`,
                                width: 'fit-content',
                                maxWidth: '100%'
                              }}
                            >
                              {Array.from({ length: registeredMaze.gridSize * registeredMaze.gridSize }).map((_, i) => {
                                const x = i % registeredMaze.gridSize;
                                const y = Math.floor(i / registeredMaze.gridSize);
                                const isWall = registeredMaze.walls.some(w => w.x === x && w.y === y);
                                const isStart = x === registeredMaze.start.x && y === registeredMaze.start.y;
                                const isExit = x === registeredMaze.exit.x && y === registeredMaze.exit.y;
                                const isOnPath = registeredMaze.path.some(p => p.x === x && p.y === y);

                                let cellStyle: React.CSSProperties = {
                                  width: '20px',
                                  height: '20px',
                                  minWidth: '20px',
                                  minHeight: '20px'
                                };

                                if (isStart) {
                                  cellStyle.backgroundColor = '#10B981'; // green
                                  cellStyle.border = '1px solid #059669';
                                } else if (isExit) {
                                  cellStyle.backgroundColor = '#EF4444'; // red
                                  cellStyle.border = '1px solid #DC2626';
                                } else if (isOnPath) {
                                  cellStyle.backgroundColor = '#FBBF24'; // yellow
                                  cellStyle.border = '1px solid #F59E0B';
                                } else if (isWall) {
                                  cellStyle.backgroundColor = '#000000'; // black
                                  cellStyle.border = '1px solid #1F2937';
                                } else {
                                  cellStyle.backgroundColor = '#FFFFFF'; // white
                                  cellStyle.border = '1px solid #E5E7EB';
                                }

                                return (
                                  <div
                                    key={i}
                                    style={cellStyle}
                                    title={`${x},${y}${isStart ? ' (Start)' : ''}${isExit ? ' (Exit)' : ''}${isOnPath ? ' (Path)' : ''}${isWall ? ' (Wall)' : ''}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-3 justify-center text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-green-500 rounded"></div>
                              <span>Start</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-red-500 rounded"></div>
                              <span>Exit</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                              <span>Path</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-black rounded"></div>
                              <span>Wall</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">Redirecting to login page in 5 seconds...</span>
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Go to Login Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Login Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-nird-blue hover:text-nird-purple transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

