import React, { useEffect, useState, useContext } from 'react';
import { useSocket } from '../Context/SocketProvider';
import { useNavigate } from 'react-router-dom';
import FrndContext from '../Context/FrndState';
import '../StyleSheets/Lobby.css';

const Lobby = () => {
  const [pageData, setPageData] = useState([]);
  const socket = useSocket();
  const navigate = useNavigate();
  const [myName, setMyName] = useState('');
  const { frnd_data, update } = useContext(FrndContext);

  useEffect(() => {
    console.log('Friend data updated:', frnd_data);
  }, [frnd_data]);

  const handleClick = (userId) => {
    socket.emit('request', userId);
    socket.emit('inform', socket.id); // Inform other clients
    update(userId);

    // Remove the user from pageData
    setPageData((prevData) => prevData.filter(user => user.soc !== userId));

    setTimeout(() => {
      navigate(`/room/${socket.id}`);
    }, 0);
  };

  useEffect(() => {
    socket.on('send', (sender_id) => {
      console.log(`${sender_id} wants to connect with you`);
      socket.emit('inform' , socket.id);
      update(sender_id);
      setTimeout(() => {
        navigate(`/room/${sender_id}`);
      }, 0);
    });

    socket.on('user:joined', (data) => {
      setPageData(data);
      const myUserData = data.find((user) => user.soc === socket.id);
      if (myUserData) {
        setMyName(myUserData.name);
      }
    });

    socket.on('user_remove', (id) => {
      setPageData((prevData) => prevData.filter(user => user.soc !== id));
    });

    return () => {
      socket.off('send');
      socket.off('user:joined');
      socket.off('user_remove');
    };
  }, [socket]);

  return (
    <div className="lobby-container">
      <h1 className="lobby-title">Lobby</h1>
      <h2 className="lobby-subtitle">Users Online</h2>
      <div className="users-container">
        {pageData.map((user, index) => (
          <div key={index} className="user-card">
            {user.soc !== socket.id && (
              <button className="user-button" onClick={() => handleClick(user.soc)}>
                {user.name}
              </button>
            )}
          </div>
        ))}
      </div>
      {myName && <p className="welcome-message">Welcome, {myName}!</p>}
    </div>
  );
};

export default Lobby;
