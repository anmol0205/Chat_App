import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../Context/SocketProvider';
import '../StyleSheets/User.css'; 

const User = () => {
  const { data } = useContext(UserContext);
  const [profile_data, setProfileData] = useState([]);

  const navigate = useNavigate();
  const socket = useSocket();

  const handleClick = () => {
    socket.emit('user:join', { profile_data });
    navigate('/Lobby');
  };

  const convert = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (event, index) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const x = await convert(file);
        
        
        const updatedProfileData = profile_data.map((profile, i) => 
          i === index ? { ...profile, photo: x } : profile
        );

        setProfileData(updatedProfileData);

        
        await axios.post('https://chat-app-mymw.onrender.com/photo', updatedProfileData[index]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    if (data.user_1) {
      setProfileData(data.user_1);
    }
  }, [data]);

  return (
    <>
      <div className="profile-container">
        {profile_data.map((e, index) => (
          <div key={index} className="profile-box">
            <label className="profile-photo-button">
              <input type="file" accept="image/*" onChange={(event) => handleFileChange(event, index)} />
              <img src={e.photo || 'https://th.bing.com/th/id/OIP.GHGGLYe7gDfZUzF_tElxiQHaHa?rs=1&pid=ImgDetMain0'} alt="" className="profile-photo" />
            </label>
            <p className="profile-name">{e.name}</p>
            <div className="friends-box">
              <div className="friends-title">Friends</div>
              {e.friends.map((k, ind) => (
                <div key={ind} className="friend-item">{k.name}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="lobby-button" onClick={handleClick}>GO TO LOBBY</button>
    </>
  );
};

export default User;
