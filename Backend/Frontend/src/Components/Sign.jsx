import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const SignUp = () => {
  const [formdata , setFormData]=useState({});
  const handlechange = (e)=>{
    const {name , value}  = e.target;
    setFormData({...formdata , [name]:value});
  }
  const [msg , setMsg] = useState('');
  const handleSubmit= async (e)=>{
    e.preventDefault();
    try{
      const response = await axios.post('https://chat-app-mymw.onrender.com/sign', formdata);
      console.log(response);
      setMsg(response.data.message);

    }
    catch(error){
      console.log('error');
    }
  }
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
          <h2 style={{ margin: '0 0 10px' }}>SIGN</h2>
          <Link to='/' style={{ textDecoration: 'none', fontSize: '14px', color: '#007bff' }}>LOGIN</Link>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name</label>
            <input onChange={handlechange} type="text" id="name" name="name" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="gender" style={{ display: 'block', marginBottom: '5px' }}>Gender</label>
            <select onChange={handlechange} id="gender" name="gender" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="dob" style={{ display: 'block', marginBottom: '5px' }}>Date of Birth</label>
            <input onChange={handlechange} type="date" id="age" name="age" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email ID</label>
            <input onChange={handlechange} type="email" id="email" name="email" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input onChange={handlechange} type="password" id="password" name="password" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{color:'red'}}>{msg}</div>
          <button  type="submit" style={{
            padding: '10px',
            borderRadius: '4px',
            border: 'none',
            background: '#007bff',
            color: '#fff',
            cursor: 'pointer'
          }}>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
