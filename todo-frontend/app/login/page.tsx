'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await api.login(email, password);
      localStorage.setItem('token', response.data.access_token);
      router.push('/tasks');
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 to-blue-600 animate-gradient-xy">
      <div className="relative w-full max-w-md">
        {/* Background shapes for visual effect */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <form 
          onSubmit={handleLogin} 
          className="relative z-10 p-8 md:p-10 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-20 transform transition-all duration-500 hover:scale-[1.02]"
        >
          <h1 className="text-4xl font-extrabold mb-8 text-center text-white drop-shadow-md">
            Welcome Back!
          </h1>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-100 p-4 rounded-lg mb-6 text-center border border-red-400 animate-shake">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="email" className="block text-white text-lg font-medium mb-3">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 pl-12 bg-white bg-opacity-20 rounded-xl border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                placeholder="your.email@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="password" className="block text-white text-lg font-medium mb-3">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-300" size={20} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 pl-12 bg-white bg-opacity-20 rounded-xl border border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white text-blue-600 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <FiLogIn size={22} />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}