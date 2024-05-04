// src/App.tsx
import React from 'react';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div className="container mx-auto px-4 bg-gray-900 h-screen text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
            <div className='h-full w-full flex flex-col justify-center items-center'>

              <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
              <SignUpForm />
              <p className="mt-8 text-center">
                Already have an account?{' '}
                <Link to="/signin" className="text-blue-500 hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
            </>
          } />
          <Route path="/signin" element={
            <>
            <div className='h-full w-full flex flex-col justify-center items-center'>
              <h1 className="text-3xl font-bold mb-4">Sign In</h1>
              <SignInForm />
              <p className="mt-8 text-center">
                Don't have an account?{' '}
                <Link to="/" className="text-blue-500 hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>

            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;