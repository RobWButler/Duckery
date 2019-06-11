// On load
(function() {
  const socket = io.connect('http://localhost:3000');

  // Store DOM elements
  const message = document.getElementById('message');
  const sendBtn = document.getElementById('send-chat');
  const chatOutput = document.getElementById('chat-output');

  const getUsername = async function() {
    const fetchRes = await fetch('/api/get-user', { method: 'GET' });
    if (fetchRes.status === 200) {
      const body = await fetchRes.json();
      return body.username;
    }
  };

  // Emit chat event
  sendBtn.addEventListener('click', async () => {
    if (!message.value) {
      return;
    }
    const username = await getUsername();
    // if (!username) // return show error
    socket.emit('chat', {
      message: message.value,
      username
    });
    message.value = '';
  });

  // Listen for enter key in chat message input
  message.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      sendBtn.click();
    }
  });

  // Listen for events
  socket.on('chat', data => {
    feedback.innerHtml = '';
    chatOutput.innerHTML += `<p><b>${data.username}: </b>${data.message}</p>`;
  });
})();
