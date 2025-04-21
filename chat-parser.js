const fs = require('fs').promises;

module.exports = async function parseChat() {
  const data = await fs.readFile('chat.txt', 'utf8');
  const lines = data.split('\n');

  const messageRegex =
    /^(\d{2}\/\d{2}\/\d{2}), (\d{2}:\d{2} [AP]M)  - (.*?): (.*)$/;
  const messages = [];

  for (const line of lines) {
    const match = messageRegex.exec(line);
    if (match) {
      const [, date, time, sender, message] = match;
      messages.push({ date, time, sender, message });
    }
  }

  return messages;
};
