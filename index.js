import express from "express";
import cors from "cors";
import createTwinRoute from "./routes/createTwin.js";

const app = express();

app.use(cors());
app.use(express.json());

// ====== ROUTES ======
app.use("/", createTwinRoute);

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
