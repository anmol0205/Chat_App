import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../Context/UserContext';
import '../StyleSheets/Home.css'; 

const Home = () => {
  const [msg, setMsg] = useState('');
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
      const response = await axios.post('https://chat-app-mymw.onrender.com/login', formData);
      console.log("Received response data:", response.data);
      
      setMsg(response.data.message);
      
      if (response.data.bit === 1) {
        console.log(response.data.user_1);
        update(response.data);
        console.log("Updated context data:", data);
        navigate('/Profile'); 
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="home-container">
      <div className="login-box">
        <div className="login-header">
          <h2>LOGIN</h2>
          <Link to='/Sign' className="sign-link">SIGN</Link>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email ID</label>
            <input type="email" id="email" name="email" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={handleChange} />
          </div>
          <button type="submit" className="login-button">Login</button>
          <div className="error-message">{msg}</div>
        </form>
      </div>
    </div>
  );
};

export default Home;
