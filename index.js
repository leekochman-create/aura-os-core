import express from "express";
import cors from "cors";

// Routes
import createTwinRoute from "./routes/createTwin.js";
import getTwinRoute from "./routes/getTwin.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Attach routes
// ככה ה־URL יוצא נקי וברור:
app.use("/", createTwinRoute);      // POST /createTwin
app.use("/", getTwinRoute);         // GET /getTwin   (או לפי מה שמוגדר ב-route)

// Root test
app.get("/", (req, res) => {
  res.send("AURA OS CORE API RUNNING");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
