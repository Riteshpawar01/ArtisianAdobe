import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useStore from '../store/useStore';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('customer');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const { login: storeLogin } = useStore();

  const handleDummyFill = () => {
    if (role === 'customer') {
      setEmail('dummy.customer@example.com');
    } else {
      setEmail('dummy.vendor@example.com');
    }
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!email || !password || (!isLogin && (!firstName || !lastName))) {
      setErrorMsg('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email, password } 
        : { firstName, lastName, email, password, role, storeName, location };

      const response = await fetch(`http://localhost:5005${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        storeLogin(data.user); // Update global state
        navigate('/');
      } else {
        setErrorMsg(data.message || 'Authentication failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('A network error occurred. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-100 p-10 shadow-sm relative overflow-hidden">
          
          {/* Role Selection Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${role === 'customer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                onClick={() => setRole('customer')}
                type="button"
              >
                Customer
              </button>
              <button 
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${role === 'vendor' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                onClick={() => setRole('vendor')}
                type="button"
              >
                Vendor
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-gray-900 tracking-wide mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 text-sm">
              {role === 'customer' 
                ? (isLogin ? 'Log in to access your wishlist and bag.' : 'Join ARTKARTZ for a premium experience.')
                : (isLogin ? 'Log in to manage your artisan store.' : 'Join as an artisan to sell your products.')}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name" 
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-400 text-sm" 
                  disabled={isLoading}
                />
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name" 
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-400 text-sm" 
                  disabled={isLoading}
                />
              </div>
            )}
            
            {/* Vendor Specific Fields for Registration */}
            {!isLogin && role === 'vendor' && (
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Store Name / Brand Name" 
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-400 text-sm" 
                  disabled={isLoading}
                />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (City, Country)" 
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-400 text-sm" 
                  disabled={isLoading}
                />
              </div>
            )}
            
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-400 text-sm" 
              disabled={isLoading}
            />
            
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent placeholder-gray-400 text-sm" 
              disabled={isLoading}
            />

            {isLogin && (
              <div className="flex justify-between items-center text-xs mt-2">
                <button 
                  type="button" 
                  onClick={handleDummyFill}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Fill Dummy Info
                </button>
                <a href="#" className="text-gray-400 hover:text-gray-900 transition-colors">Forgot password?</a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full text-white font-medium py-3 text-sm tracking-widest transition-colors mt-4 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
            >
              {isLoading ? 'PLEASE WAIT...' : (isLogin ? 'SIGN IN' : 'REGISTER')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-gray-900 font-medium underline underline-offset-4">
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
