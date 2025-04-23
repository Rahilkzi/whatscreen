
let currentPage = 1;
let loading = false;
let hasMore = true;

function createMessageElement(msg) {
  return `
    <div class="message ${msg.sender === 'Me' ? 'me' : 'them'}">
      <strong>${msg.sender}</strong><br>
      ${msg.message}
      <div class="timestamp">${msg.date} ${msg.time}</div>
    </div>
  `;
}

async function loadMoreMessages() {
  if (loading || !hasMore) return;
  
  loading = true;
  const searchInput = document.querySelector('input[type="text"]').value;
  const dateInput = document.querySelector('input[type="date"]').value;
  const queryParams = new URLSearchParams({ 
    search: searchInput, 
    date: dateInput,
    page: currentPage + 1 
  });

  try {
    const response = await fetch(`/api/messages?${queryParams}`);
    const data = await response.json();
    
    if (data.messages.length > 0) {
      const chatArea = document.querySelector('.chat-area');
      data.messages.forEach(msg => {
        chatArea.insertAdjacentHTML('beforeend', createMessageElement(msg));
      });
      currentPage++;
      hasMore = data.hasMore;
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  } finally {
    loading = false;
  }
}

function handleScroll(e) {
  const chatArea = e.target;
  if (chatArea.scrollHeight - chatArea.scrollTop <= chatArea.clientHeight + 100) {
    loadMoreMessages();
  }
}

function resetAndReload() {
  const chatArea = document.querySelector('.chat-area');
  chatArea.innerHTML = '';
  currentPage = 0;
  hasMore = true;
  loadMoreMessages();
}

document.addEventListener('DOMContentLoaded', () => {
  const chatArea = document.querySelector('.chat-area');
  chatArea.addEventListener('scroll', handleScroll);
  
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', resetAndReload);
  });
});
