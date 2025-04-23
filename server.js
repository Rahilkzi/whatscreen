const express = require("express");
const app = express();
const path = require("path");
const parser = require("./chat-parser");

// Set view engine
app.set("view engine", "ejs");

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// API endpoint for paginated messages (used by frontend JS)
app.get("/api/messages", async (req, res) => {
  const { search = "", date = "", page = 1 } = req.query;
  let messages = await parser();

  // Filter by search term
  if (search) {
    messages = messages.filter((m) =>
      m.message.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by date (convert YYYY-MM-DD to DD/MM/YY)
  if (date) {
    const formattedDate = date.split("-").reverse().join("/");
    messages = messages.filter((m) => m.date === formattedDate);
  }

  messages = messages.reverse(); // Show latest messages first

  const pageSize = 100;
  const startIndex = (page - 1) * pageSize;
  const pagedMessages = messages.slice(startIndex, startIndex + pageSize);

  res.json({
    messages: pagedMessages,
    hasMore: startIndex + pageSize < messages.length,
  });
});


// Page render with optional filters (on initial page load)
app.get("/", async (req, res) => {
  const { search = "", date = "" } = req.query;
  let messages = await parser();

  if (search) {
    messages = messages.filter((m) =>
      m.message.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (date) {
    const formattedDate = date.split("-").reverse().join("/");
    messages = messages.filter((m) => m.date === formattedDate);
  }

  messages = messages.reverse(); // Show latest first

  const pageSize = 100;
  const firstPageMessages = messages.slice(0, pageSize);

  res.render("index", { messages: firstPageMessages, search, date });
});

// Export for Vercel's serverless functions
module.exports = app;
