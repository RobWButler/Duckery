const events = require('./events');

module.exports = io => {
 io.on(events.CONNECTION, socket => {
    console.log('Socket made connection', socket.id);

    // Handle chat event
    socket.on(events.CHAT, data => {
      // Send chat data to all connected sockets
      io.sockets.emit(events.CHAT, data);
    });

    // Handle typing event
    socket.on(events.TYPING, data => {
      // Send typing to everyone except the person typing
      socket.broadcast.emit(events.TYPING, data);
    });
  });
};
