import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MazePathSolver from '../components/MazePathSolver';
import { getMaze, login } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [mazeConfig, setMazeConfig] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoadMaze = async () => {
    if (!username) return;
    setLoading(true);
    setError('');
    try {
      const data = await getMaze(username);
      setMazeConfig(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'User not found');
      setMazeConfig(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSolve = async (path: any[]) => {
    setError('');
    try {
      const data = await login(username, path);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed - Path does not match your registered maze');
      // Reset maze to allow retry
      setMazeConfig(null);
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
              <Link to="/register" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
                Sign Up
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

          {/* Right Section - Login Form */}

          <div className="flex-1 lg:w-1/2 p-8 lg:p-12 flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(37, 99, 235, 0.2)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(37, 99, 235, 0.1)'
            }}
          >
            {!mazeConfig ? (
              <div className="flex flex-col gap-6">
                <div>
                  <label
                    className="block mb-3 font-bold uppercase tracking-wider text-sm"
                    style={{ color: '#2563EB' }}
                  >
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && username && !loading) {
                          handleLoadMaze();
                        }
                      }}
                      className="w-full py-4 px-5 rounded-xl border-2 transition-all duration-300 text-gray-800 font-medium placeholder-gray-400"
                      style={{
                        borderColor: username ? '#2563EB' : '#E5E7EB',
                        background: '#FFFFFF',
                        outline: 'none',
                        boxShadow: username
                          ? '0 0 0 3px rgba(37, 99, 235, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2563EB';
                        e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                      }}
                      onBlur={(e) => {
                        if (!username) {
                          e.target.style.borderColor = '#E5E7EB';
                          e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                        }
                      }}
                      placeholder="Enter your username"
                    />
                    {username && (
                      <div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full"
                        style={{ background: '#10B981' }}
                      />
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLoadMaze}
                  disabled={loading || !username}
                  className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: loading || !username
                      ? 'linear-gradient(135deg, #9CA3AF, #6B7280)'
                      : 'linear-gradient(135deg, #2563EB, #9333EA)',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && username) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #9333EA, #EC4899)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading && username) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #2563EB, #9333EA)';
                    }
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Load Maze'
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold mb-2 text-gradient">
                    Draw Your Path
                  </h2>
                  <p className="text-gray-600 text-sm font-medium">
                    Click cells to draw your path. Remember your pattern from registration.
                  </p>
                </div>
                <MazePathSolver
                  gridSize={mazeConfig.gridSize}
                  walls={mazeConfig.walls}
                  start={mazeConfig.start}
                  exit={mazeConfig.exit}
                  onSolve={handleSolve}
                />
                <button
                  onClick={() => {
                    setMazeConfig(null);
                    setError('');
                  }}
                  className="mt-6 text-sm text-gray-500 hover:text-nird-blue transition-colors duration-200 font-medium"
                >
                  ← Switch User
                </button>
              </div>
            )}

            {error && (
              <div
                className="mt-6 p-4 rounded-xl border"
                style={{
                  background: 'rgba(254, 242, 242, 0.8)',
                  borderColor: '#FCA5A5'
                }}
              >
                <p style={{ color: '#DC2626' }} className="text-center text-sm font-semibold">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

