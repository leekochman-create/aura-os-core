import express from "express";
import cors from "cors";

import createTwinRoute from "./routes/createTwin.js";
import getTwinRoute from "./routes/getTwin.js";
import uploadMediaRoute from "./routes/uploadMedia.js";

const app = express();

// CORS
app.use(cors());

// חשוב! JSON אחרי ה־upload ולא לפני
app.use("/upload", uploadMediaRoute);

// JSON אחרי multer
app.use(express.json());

// ROUTES
app.use("/create_twin", createTwinRoute);
app.use("/get_twin", getTwinRoute);

// TEST
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING ✔");
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
