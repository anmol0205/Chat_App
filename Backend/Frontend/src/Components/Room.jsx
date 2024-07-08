import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from '../Context/SocketProvider';
import ReactPlayer from 'react-player';
import FrndContext from '../Context/FrndState';
import peer from '../service/peer.js';
import Message from './Message.jsx';
import '../StyleSheets/Room.css';

const Room = () => {
  const[bit , setbit]=useState(0);
  const [msg_data, setMsgData] = useState('');
  const [render_data, setRenderData] = useState([]);
  const { frnd_data } = useContext(FrndContext);
  const [mystream, setMystream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const socket = useSocket();

  const sendStreams = useCallback(() => {
    if (bit===0) {
      for (const track of mystream.getTracks()) {
        peer.peer.addTrack(track, mystream);
      }
    }
    setbit(1);
  }, [mystream, remoteStream]);

  const handleClick = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const offer = await peer.getOffer();
      socket.emit('getoffer', { offer: offer, id: frnd_data });
      setMystream(stream);
      console.log(mystream);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Error accessing media devices: ' + error.message);
    }
  }, [frnd_data, socket]);

  const handleAnswer = useCallback(async (data) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMystream(stream);
      
      const ans = await peer.getAnswer(data.offer);
      console.log(ans);
      socket.emit('accepted', { answer: ans, to_id: data.id });
    } catch (error) {
      console.error('Error in handleAnswer:', error);
    }
  }, [socket]);

  const handleAcception = useCallback(async (data) => {
    try {
      await peer.set_Remote_Description(data.ans);
      
      console.log('Answer set to remote description.');
      
    } catch (error) {
      console.error('Error in handleAcception:', error);
    }
  }, [sendStreams]);

  const handleReceiveMessage = useCallback((res) => {
    const messageObject = { message: res.msg, name: res.name };
    setRenderData(prevData => [...prevData, messageObject]);
  }, []);

  

  const handleNegoNeeded = useCallback(async () => {
    try {
      console.log('Making offer again');
      const offer = await peer.getOffer();
      socket.emit('peer:nego:needed', { offer: offer, to: frnd_data });
    } catch (error) {
      console.error('Error in handleNegoNeeded:', error);
    }
  }, [frnd_data, socket]);


  const handleNegoNeedIncomming = useCallback(async (data) => {
    try {
      const ans = await peer.getAnswer(data.offer);
      console.log('Negotiation needed', ans);
      socket.emit('peer:nego:done', { answer: ans, to: data.id });
    } catch (error) {
      console.error('Error in handleNegoNeedIncomming:', error);
    }
  }, [socket]);

  const handleNegoNeedFinal = useCallback(async (e) => {
    try {
      await peer.set_Remote_Description(e.answer);
      console.log("Answer set to local description.");
    } catch (error) {
      console.error('Error in handleNegoNeedFinal:', error);
    }
  }, []);
  
  useEffect(() => {
    socket.on('receive_message', handleReceiveMessage);
    socket.on('peer:nego:needed', handleNegoNeedIncomming);
    socket.on('peer:nego:final', handleNegoNeedFinal);
    socket.on('set', handleAcception);
    socket.on('getanswer', handleAnswer);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('peer:nego:needed', handleNegoNeedIncomming);
      socket.off('peer:nego:final', handleNegoNeedFinal);
      socket.off('set', handleAcception);
      socket.off('getanswer', handleAnswer);
    };
  }, [socket, handleReceiveMessage, handleNegoNeedIncomming, handleNegoNeedFinal, handleAcception, handleAnswer]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);

    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
    };
  }, [ handleNegoNeeded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageObject = { message: msg_data, name: 'you' };
    setRenderData(prevData => [...prevData, messageObject]);

    socket.emit('send_message', { data: msg_data, id: frnd_data });
    setMsgData(''); 
  };

  return (
    <div className="room-container">
      <h2 className="room-title">Room Page</h2>
      <div className="video-container">
        <div className="video-box">{mystream && <ReactPlayer url={mystream} playing muted />}</div>
        <div className="video-box">{remoteStream && <ReactPlayer url={remoteStream} playing  />}</div>
      </div>
      <div className="message-container">
        <div className="messages">
          {render_data.map((item, index) => (
            <Message key={index} name={item.name} message={item.message} />
          ))}
        </div>
      </div>
      <div className="message-input-container">
        <form onSubmit={handleSubmit} className="message-form">
          <input
            name='msg'
            type='text'
            value={msg_data}
            onChange={(e) => setMsgData(e.target.value)}
            placeholder='Type your message...'
            className="message-input"
          />
          <button type='submit' className="send-button">Send</button>
        </form>
      </div>
      <div className="button-container">
        {!mystream && <button className="start-video-button" onClick={handleClick}>Start Video</button>}
        {mystream&& bit===0 && <button className="send-stream-button" onClick={sendStreams}>Send Stream</button>}
      </div>
    </div>
  );
};

export default Room;
