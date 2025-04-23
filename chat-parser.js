const fs = require('fs').promises;
const path = require('path');

module.exports = async function parseChat() {
  try {
    const filePath = path.join(__dirname, 'chat.json'); // Resolves the absolute path
    console.log('File path:', filePath); // Optional: Log to verify correct path

    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading chat.json:', error);
    return []; // Return an empty array if there’s an error
  }
};
