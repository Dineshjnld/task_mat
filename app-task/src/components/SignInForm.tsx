// src/components/SignInForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignInForm: React.FC = () => {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://task-m-5j5p.onrender.com/api/signin', formData);
      localStorage.setItem('token', response.data.token);
      alert('Successfully logged in');
      nav('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-black">
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full py-3 px-4 border rounded-md"
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full py-3 px-4 border rounded-md"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md">
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
