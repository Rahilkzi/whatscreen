const express = require("express");
const app = express();
const path = require("path");
const parser = require("./chat-parser");
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/messages", async (req, res) => {
  try {
    const { search = "", date = "", page = 1 } = req.query;
    let messages = await parser();
    
    messages = messages.reverse(); // Latest first

    if (search) {
      messages = messages.filter((m) =>
        m.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (date) {
      messages = messages.filter(
        (m) => m.date === date.split("-").reverse().join("/")
      );
    }

    const pageSize = 50;
    const startIndex = (page - 1) * pageSize;
    const pagedMessages = messages.slice(startIndex, startIndex + pageSize);

    res.json({
      messages: pagedMessages,
      hasMore: startIndex + pageSize < messages.length
    });
  } catch (error) {
    console.error('Error loading messages:', error);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

app.get("/", (req, res) => {
  const { search = "", date = "" } = req.query;
  res.render("index", { search, date });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});