// On load
(function() {
  // const HOST = location.origin.replace(/^http/, 'ws');
  // const socket = io.connect(HOST);
  const socket = io.connect('localhost:3000');

  // Store DOM elements
  const chatForm = document.getElementById('chat-form');
  const chatSendBtn = document.getElementById('chat-send');
  const chatOutput = document.getElementById('chat-output');
  const chatWindow = document.getElementById('chat-window');
  const chatMessage = document.getElementById('message');
  const errorDisplay = document.getElementById('error-display');
  const errorMessage = document.getElementById('error-message');
  const errorDismiss = document.getElementById('error-dismiss');

  // POST chat on submit
  chatForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const newChat = { message: chatMessage.value };
    const fetchRes = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newChat)
    });
    if (fetchRes.status !== 200) {
      errorMessage.innerText = 'Error sending chat message';
      errorDismiss.style.display = 'block';
      return;
    }
    errorMessage.innerText = '';
    errorDismiss.style.display = 'none';
  });

  // Keep chat window scrolled to bottom
  const scrollToBottom = () => {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  const getUsername = async function() {
    const fetchRes = await fetch('/api/get-user', { method: 'GET' });
    if (fetchRes.status === 200) {
      const body = await fetchRes.json();
      return body.username;
    }
  };

  // Emit chat event
  chatSendBtn.addEventListener('click', async () => {
    if (!chatMessage.value) {
      return;
    }
    const username = await getUsername();
    if (!username) {
      errorMessage.innerText = 'Please login to use chat';
      errorDisplay.style.display = 'block';
      return;
    }
    errorMessage.innerText = '';
    errorDisplay.style.display = 'none';
    socket.emit('chat', {
      message: chatMessage.value,
      username
    });
    chatMessage.value = '';
  });

  // Listen for enter key in chat message input
  chatMessage.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
      chatSendBtn.click();
    }
  });

  errorDismiss.addEventListener('click', () => {
    errorDisplay.style.display = 'none';
  });

  // Listen for chat event
  socket.on('chat', data => {
    chatOutput.innerHTML += `<p><b>${data.username}:</b> ${data.message}</p>`;
    scrollToBottom();
  });

  scrollToBottom();
})();
