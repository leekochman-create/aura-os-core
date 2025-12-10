import express from "express";
import cors from "cors";

import createTwinRoute from "./routes/createTwin.js";
import getTwinRoute from "./routes/getTwin.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/create_twin", createTwinRoute);
app.use("/get_twin", getTwinRoute);

app.get("/", (req, res) => {
  res.send("AURA OS CORE API RUNNING");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
