
function loadMessages() {
  const searchInput = document.querySelector('input[type="text"]').value;
  const dateInput = document.querySelector('input[type="date"]').value;
  const queryParams = new URLSearchParams({ search: searchInput, date: dateInput });

  fetch(`/api/messages?${queryParams}`)
    .then(response => response.json())
    .then(messages => {
      const chatArea = document.querySelector('.chat-area');
      chatArea.innerHTML = messages.map(msg => `
        <div class="message ${msg.sender === 'Me' ? 'me' : 'them'}">
          <strong>${msg.sender}</strong><br>
          ${msg.message}
          <div class="timestamp">${msg.date} ${msg.time}</div>
        </div>
      `).join('');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', loadMessages);
  });
  loadMessages();
});
