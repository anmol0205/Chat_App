import React from 'react';

const Message = ({ name, message }) => {
  const isCurrentUser = name === 'you';
  const messageStyles = {
    display: 'flex',
    justifyContent: 'center',
    background: 'blue',
    margin: '5px auto',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '60%',
    alignSelf: 'center',
    color: 'white',
  };

  const messageContentStyles = {
    display: 'flex',
    
  };

  return (
    <div style={messageStyles}>
      <div style={messageContentStyles}>
        <strong>{name}:</strong> {message}
      </div>
    </div>
  );
};

export default Message;
