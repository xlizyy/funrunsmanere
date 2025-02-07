import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

export default function AdminLogin({ setIsAuthenticated }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication - in real world, this should be done securely
    if (username === 'admin' && password === '@sman1Turen') {
      localStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div className="max-w-md mx-auto pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="bg-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-purple-700" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-purple-100 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white/80 backdrop-blur-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-100 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white/80 backdrop-blur-sm"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-200 font-medium shadow-lg hover:shadow-purple-500/25"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
