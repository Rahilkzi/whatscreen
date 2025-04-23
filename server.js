const express = require("express");
const app = express();
const path = require("path");
const parser = require("./chat-parser");
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/messages", async (req, res) => {
  const { search = "", date = "", page = 1 } = req.query;
  const pageSize = 50;
  let messages = await parser();

  if (search) {
    messages = messages.filter((m) =>
      m.message.toLowerCase().includes(search.toLowerCase()),
    );
  }

  if (date) {
    messages = messages.filter(
      (m) => m.date === date.split("-").reverse().join("/"),
    );
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMessages = messages.slice(startIndex, endIndex);

  res.json({
    messages: paginatedMessages,
    hasMore: endIndex < messages.length,
  });
});

app.get("/", async (req, res) => {
  const { search = "", date = "" } = req.query;
  let messages = await parser();

  if (search) {
    messages = messages.filter((m) =>
      m.message.toLowerCase().includes(search.toLowerCase()),
    );
  }
  if (date) {
    messages = messages.filter(
      (m) => m.date === date.split("-").reverse().join("/"),
    );
  }

  const firstPage = messages.slice(0, 50);
  res.render("index", { messages: firstPage, search, date });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
