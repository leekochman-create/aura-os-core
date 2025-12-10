import express from "express";
import cors from "cors";

// ROUTES
import createTwinRoute from "./routes/createTwin.js";
import getTwinRoute from "./routes/getTwin.js";

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/create_twin", createTwinRoute);
app.use("/get_twin", getTwinRoute);

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("AURA OS CORE API RUNNING");
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
