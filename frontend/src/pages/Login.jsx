import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
        <h2 className="text-xl font-bold">Login</h2>
        <input className="w-full p-2 border rounded" type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input className="w-full p-2 border rounded" type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button className="w-full bg-green-500 text-white py-2 rounded" type="submit">Login</button>
      </form>
    </div>
  );
}