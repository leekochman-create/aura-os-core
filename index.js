import express from "express";
import cors from "cors";

// Routes
import createTwinRoute from "./routes/createTwin.js";
import getTwinRoute from "./routes/getTwin.js";

// FIXED: correct supabase import path
import { supabase } from "./services/supabase.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Attach routes
app.use("/", createTwinRoute);
app.use("/", getTwinRoute);

// Test route
app.get("/", (req, res) => {
  res.send("AURA OS CORE API RUNNING");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
