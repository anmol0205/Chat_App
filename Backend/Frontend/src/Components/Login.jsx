import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../Context/UserContext';

const Login = () => {
  const [msg , setMsg] = useState('');
  const { data, update } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://restaurant-webapp-95px.onrender.com/auth/login', formData);
      console.log("Received response data:", response.data);
      
      setMsg(response.data.message);
      
      
      if (response.data.bit === 1) {
        console.log(response.data.user_1);
        update(response.data.user_1[0].name);
        console.log("Updated context data:", data);
        navigate('/'); 
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
            background: 'orange',
            color: '#fff',
            cursor: 'pointer'
          }}>Login</button>
          <div style={{color:'red'}}>{msg}</div>
        </form>

      </div>
    </div>
  );
};

export default Login;
