import React, { useEffect, useState, useContext } from 'react';
import { useSocket } from '../Context/SocketProvider';
import { useNavigate } from 'react-router-dom';
import FrndContext from '../Context/FrndState';
import '../StyleSheets/Lobby.css';

const Lobby = () => {
  const [pageData, setPageData] = useState([]);
  const [myName, setMyName] = useState('');
  const [frnd_name, setfrnd_name] = useState('');
  const [frnd_id, setfrnd_id] = useState('');
  const [msg, setmsg] = useState('');
  
  const socket = useSocket();
  const navigate = useNavigate();
  const { frnd_data, update } = useContext(FrndContext);

  useEffect(() => {
    console.log('Friend data updated:', frnd_data);
  }, [frnd_data]);

  const handleClick = async (userId) => {
    await socket.emit('request', userId);
    update(userId);
  };

  const accept = () => {
    update(frnd_id);
    setPageData((prevData) => prevData.filter(user => user.soc !== frnd_id));
    socket.emit('accept', frnd_id);
    socket.emit('inform', frnd_id);
    setTimeout(() => {
      navigate(`/room/${frnd_id}`);
    }, 0);
  };

  const reject = () => {
    socket.emit('rejected', socket.id);
  };

  useEffect(() => {
    const handleSend = (sender) => {
      console.log(sender);
      console.log('call came');
      setfrnd_name(sender.name);
      setfrnd_id(sender.id);
      console.log(frnd_name);
      console.log(frnd_id);
    };

    const handleUserJoined = (data) => {
      setPageData(data);
      const myUserData = data.find((user) => user.soc === socket.id);
      if (myUserData) {
        setMyName(myUserData.name);
      }
    };

    const handleCallAccepted = (id) => {
      socket.emit('inform', socket.id);
      setPageData((prevData) => prevData.filter(user => user.soc !== frnd_data));
      setTimeout(() => {
        navigate(`/room/${socket.id}`);
      }, 0);
    };

    const handleCallRejected = (id) => {
      setmsg('call rejected');
    };

    const handleUserRemove = (id) => {
      setPageData((prevData) => prevData.filter(user => user.soc !== id));
    };

    socket.on('send', handleSend);
    socket.on('user:joined', handleUserJoined);
    socket.on('call_accepted', handleCallAccepted);
    socket.on('call_rejected', handleCallRejected);
    socket.on('user_remove', handleUserRemove);

    return () => {
      socket.off('send', handleSend);
      socket.off('user:joined', handleUserJoined);
      socket.off('call_accepted', handleCallAccepted);
      socket.off('call_rejected', handleCallRejected);
      socket.off('user_remove', handleUserRemove);
    };
  }, [socket, navigate]);

  return (
    <div className="lobby-container">
      <h1 className="lobby-title">Lobby</h1>
      <h2 className="lobby-subtitle">Users Online</h2>
      {frnd_name && 
        <div className='pop-up'>
          <h1>{frnd_name}</h1>
          <div className='select-box'>
            <button onClick={accept}>YES</button>
            <button onClick={reject}>NO</button>
          </div>
        </div>
      }
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
