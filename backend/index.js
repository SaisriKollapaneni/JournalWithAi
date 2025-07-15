// backend/index.js
// A minimal Express server that:
// 1. Loads journal entries from entries.json on startup
// 2. Exposes CRUD endpoints
// 3. Keeps everything in memory during runtime
// 4. Persists to entries.json when the process exits (CTRL‑C, SIGTERM, etc.)
//  Run:  node index.js   (PORT defaults to 4000)

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, "entries.json");

app.use(cors());
app.use(express.json());

/*************************
 * 1. Load entries on boot
 *************************/
let entries = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    entries = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    console.log(`Loaded ${entries.length} journal entries from disk.`);
  }
} catch (err) {
  console.error("⚠️  Failed to read entries.json – starting with empty list.", err);
}

/*************************
 * 2. Helper – save to disk
 *************************/
function persistToDisk() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
    console.log("💾 entries.json saved (", entries.length, "entries )");
  } catch (err) {
    console.error("❌ Could not write entries.json", err);
  }
}

/*************************
 * 3. API routes
 *************************/
// GET all
app.get("/entries", (req, res) => {
  res.json(entries);
});

// GET one by id (date string)
app.get("/entries/:id", (req, res) => {
  const e = entries.find((en) => en.id === req.params.id);
  if (!e) return res.status(404).json({ error: "Entry not found" });
  res.json(e);
});

// POST create
app.post("/entries", (req, res) => {
  const entry = req.body;
  if (!entry?.id) return res.status(400).json({ error: "Missing id" });
  entries.push(entry);
  res.status(201).json(entry);
});

// PUT update
app.put("/entries/:id", (req, res) => {
  const entry = entries.find((en) => en.id === req.params.id);
  if (!entry) return res.status(404).json({ error: "Entry not found" });
  Object.assign(entry, req.body);
  res.json(entry);
});

// DELETE remove
app.delete("/entries/:id", (req, res) => {
  entries = entries.filter((en) => en.id !== req.params.id);
  res.status(204).end();
});

/*************************
 * 4. Graceful shutdown
 *************************/
function handleExit(signal) {
  console.log(`\n${signal} received – saving entries & shutting down…`);
  persistToDisk();
  process.exit(0);
}

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);
process.on("exit", persistToDisk);

// POST generate AI feedback
app.post("/generate-feedback", async (req, res) => {
  const entry = req.body;

  const prompt = `
You are a compassionate therapist and journal advisor.
Here is someone's journal entry:
- Todo: ${entry.todo?.join(", ") || "N/A"}
- Wins: ${entry.wins?.join(", ") || "N/A"}
- Quote: ${entry.quote || "N/A"}
- Inspirational Thought: ${entry.inspiration || "N/A"}
- Emotions: ${entry.emotions?.join(", ") || "N/A"}
- Reflection: ${entry.reflection || "N/A"}

Please write a thoughtful, kind feedback (3–5 sentences) to help this person reflect and grow.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
    });

    const feedback = response.choices[0].message.content.trim();
    res.json({ feedback });
  } catch (err) {
    console.error("❌ OpenAI error:", err);
    res.status(500).json({ error: "Failed to generate AI feedback" });
  }
});

/*************************
 * 5. Start server
 *************************/
app.listen(PORT, () => {
  console.log(`🚀 Journal API running at http://localhost:${PORT}`);
});
