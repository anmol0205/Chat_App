import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../Context/UserContext';

const Login = () => {
  const { data, update } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      console.log("Received response data:", response.data);
      update(response.data);
      console.log("Updated context data:", data);
      if (response.data.bit === 1) {
        navigate('/profile'); 
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
        width: '300px'
      }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px' }}>LOGIN</h2>
          <Link to='/Sign' style={{ textDecoration: 'none', fontSize: '14px', color: '#007bff' }}>SIGN</Link>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email ID</label>
            <input type="email" id="email" name="email" onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input type="password" id="password" name="password" onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <button type="submit" style={{
            padding: '10px',
            borderRadius: '4px',
            border: 'none',
            background: '#007bff',
            color: '#fff',
            cursor: 'pointer'
          }}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
