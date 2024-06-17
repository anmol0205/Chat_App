const { Server } = require("socket.io");
const io = new Server(8000, {
  cors: true,
});
let users = [];
let sock_to_user = {};

io.on("connection", (socket) => {
  console.log('socket connected', socket.id);

  socket.on('user:join', (data) => {
    try {
      console.log(data.profile_data[0]);
      const email = data.profile_data[0].email;
      data.profile_data[0].soc = socket.id;
      sock_to_user[socket.id] = data.profile_data[0];

      let existingIndex = users.findIndex((user) => user.email === email);

      if (existingIndex !== -1) {
        users[existingIndex].soc = socket.id;
      } else {
        users.push(data.profile_data[0]);
      }

      io.emit('user:joined', users);
    } catch (error) {
      console.error('Error in user:join:', error);
    }
  });

  socket.on('request', (id) => {
    try {
       

        io.to(id).emit('send', { id: socket.id, name: sock_to_user[socket.id].name });
    } catch (error) {
        console.error('Error in request:', error);
    }
});

  socket.on('accept', (id)=>{
    socket.to(id).emit('call_accepted', id);
  })
  socket.on('rejected', (id)=>{
    socket.to(id).emit('call_rejected',id);
  })

  socket.on('inform', (id) => {
    try {
      let existingIndex = users.findIndex((user) => user.soc === socket.id);

      if (existingIndex !== -1) {
          users.splice(existingIndex, 1);
      }


      io.emit('user_remove', id);
    } catch (error) {
      console.error('Error in inform:', error);
    }
  });

  socket.on('send_message', (obj) => {
    try {
      io.to(obj.id).emit('receive_message', {
        msg: obj.data,
        name: sock_to_user[socket.id].name
      });
    } catch (error) {
      console.error('Error in send_message:', error);
    }
  });

  socket.on('getoffer', (data) => {
    try {
      console.log("getoffer :", data);
      io.to(data.id).emit('getanswer', { offer: data.offer, id: socket.id });
    } catch (error) {
      console.error('Error in getoffer:', error);
    }
  });

  socket.on('accepted', (obj) => {
    try {
      console.log("accepted : ", obj);
      console.log(obj);
      io.to(obj.to_id).emit('set', { ans: obj.answer });
    } catch (error) {
      console.error('Error in accepted:', error);
    }
  });

  socket.on('peer:nego:needed', (obj) => {
    try {
      console.log("peer:nego:needed :", obj);
      io.to(obj.to).emit('peer:nego:needed', { offer: obj.offer, id: socket.id });
    } catch (error) {
      console.error('Error in peer:nego:needed:', error);
    }
  });

  socket.on('peer:nego:done', (obj) => {
    try {
      console.log("peer:nego:done:",obj);
      io.to(obj.to).emit('peer:nego:final', { answer: obj.answer });
    } catch (error) {
      console.error('Error in peer:nego:done:', error);
    }
  });
});
