const socket = io.connect('http://localhost:4000');

// Store DOM elements
const message = $('#message'),
  handle = $('#handle'),
  sendBtn = $('#send-btn'),
  chatOutput = $('#chat-output');

// Emit chat event
sendBtn.on('click', () => {
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
  });
  message.value = '';
});

message.on('keypress', () => {
  socket.emit('typing', handle.value);
});

// Listen for events
socket.on('chat', data => {
  feedback.innerHtml = '';
  chatOutput.innerHtml += `<p><b>${data.handle}:</b> ${data.message}</p>`;
});

socket.on('typing', data => {
  feedback.innerHtml = `<p><i>${data} is typing...</i></p>`;
});
