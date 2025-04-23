
let currentPage = 1;
let loading = false;
let hasMore = true;

async function loadMoreMessages(isInitialLoad = false) {
  if (loading || (!hasMore && !isInitialLoad)) return;
  
  loading = true;
  if (isInitialLoad) {
    currentPage = 1;
    hasMore = true;
  }
  const searchInput = document.querySelector('input[type="text"]').value;
  const dateInput = document.querySelector('input[type="date"]').value;
  const queryParams = new URLSearchParams({ 
    search: searchInput, 
    date: dateInput, 
    page: currentPage 
  });

  try {
    const response = await fetch(`/api/messages?${queryParams}`);
    const data = await response.json();
    const chatArea = document.querySelector('.chat-area');
    
    if (data.messages.length > 0) {
      const fragment = document.createDocumentFragment();
      data.messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${msg.sender === 'Me' ? 'me' : 'them'}`;
        messageElement.innerHTML = `
          <strong>${msg.sender}</strong><br>
          ${msg.message}
          <div class="timestamp">${msg.date} ${msg.time}</div>
        `;
        fragment.appendChild(messageElement);
      });

      if (isInitialLoad) {
        chatArea.innerHTML = '';
        chatArea.appendChild(fragment);
        chatArea.scrollTop = 0;
      } else {
        chatArea.appendChild(fragment);
      }
      
      currentPage++;
      hasMore = data.hasMore;
    } else {
      hasMore = false;
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  } finally {
    loading = false;
  }
}

function resetAndReload() {
  const chatArea = document.querySelector('.chat-area');
  chatArea.innerHTML = '';
  currentPage = 1;
  hasMore = true;
  loadMoreMessages(true);
}

function handleScroll(e) {
  const chatArea = e.target;
  const scrollThreshold = chatArea.scrollHeight * 0.2;
  if (chatArea.scrollTop <= scrollThreshold && hasMore && !loading) {
    loadMoreMessages();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const chatArea = document.querySelector('.chat-area');
  chatArea.style.overflowY = 'auto';
  chatArea.style.height = 'calc(100vh - 120px)';
  chatArea.style.flexDirection = 'column';
  
  chatArea.addEventListener('scroll', handleScroll);
  
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', resetAndReload);
  });
  
  loadMoreMessages(true);
});
