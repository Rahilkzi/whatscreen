const express = require('express');
const app = express();
const path = require('path');
const parser = require('./chat-parser');
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', async (req, res) => {
  const { search = '', date = '' } = req.query;
  let messages = await parser();

  if (search) {
    messages = messages.filter((m) =>
      m.message.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (date) {
    messages = messages.filter(
      (m) => m.date === date.split('-').reverse().join('/')
    );
  }

  res.render('index', { messages, search, date });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
