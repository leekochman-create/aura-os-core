import express from "express";
import cors from "cors";

import createTwinRoute from "./routes/createTwin.js";
import getTwinRoute from "./routes/getTwin.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/create_twin", createTwinRoute);
app.use("/get_twin", getTwinRoute);

// Test route
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING ✔");
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
