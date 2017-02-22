const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(PORT);

console.log(`Listening on 127:0.0.1: ${PORT}`);

// pass http server to socketio & grab websocket server as io
const io = socketio(app);

// obj holds all connected users
// const users = {};// not sure i need this

const onJoined = (sock) => {
  const socket = sock;
  socket.on('join', () => {
    socket.join('room1');
  });
};

const onUpdate = (sock) => {
  const socket = sock;

//  socket.on('updateToServer', (data) => {
//    //console.log('in updateToServer');
//    console.dir(data);
//
//    io.sockets.in('room1').emit('update');
//  });

  socket.on('draw', (data) => {
    // hello person just drew something
    // you gotta handleMessage
    // if you want to change colors so that personal square
    // color is different than anyone elses do it here
    const data2 = data;
    data2.coords.color = 'gold';
    socket.broadcast.to('room1').emit('updateDraw', data2);
  });

//  socket.on('clearToServer', () => {
//    console.log('clear called');
//    io.sockets.in('room1').emit('clear');
//  });
};


const onDisconnect = (sock) => {
  const socket = sock;// not sure why this is like this :/

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
};


io.sockets.on('connection', (socket) => {
  onJoined(socket);
  onUpdate(socket);
  onDisconnect(socket);
});

console.log('Websocket server started');
