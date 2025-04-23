
const fs = require('fs').promises;

module.exports = async function parseChat() {
  try {
    const data = await fs.readFile('chat.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading chat.json:', error);
    return [];
  }
};
