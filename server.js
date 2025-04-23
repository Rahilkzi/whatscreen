const express = require("express");
const app = express();
const path = require("path");
const parser = require("./chat-parser");
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/messages", async (req, res) => {
  const { search = "", date = "", page = 1 } = req.query;
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

  messages = messages.reverse(); // Latest first
  const pageSize = 20;
  const startIndex = (page - 1) * pageSize;
  const pagedMessages = messages.slice(startIndex, startIndex + pageSize);

  res.json({
    messages: pagedMessages,
    hasMore: startIndex + pageSize < messages.length,
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

  res.render("index", { messages, search, date });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
