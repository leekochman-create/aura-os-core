import express from "express";
import cors from "cors";

import createTwinRoute from "./routes/createTwin.js";
import getTwinRoute from "./routes/getTwin.js";
import uploadMediaRoute from "./routes/uploadMedia.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/create_twin", createTwinRoute);
app.use("/get_twin", getTwinRoute);
app.use("/upload", uploadMediaRoute);

app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING ✔");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
