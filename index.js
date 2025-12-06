import express from "express";
import cors from "cors";

// ==== ROUTES ====
import createTwinRoute from "./routes/createTwin.js";
import speakRoute from "./routes/speak.js";
import twinRoute from "./routes/twin.js";   // <<< חדש – שליפת תאום לפי ID

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== ROUTES ======
app.use("/createTwin", createTwinRoute);   // יצירת תאום
app.use("/speak", speakRoute);             // יצירת קול OPENAI
app.use("/twin", twinRoute);               // <<< חדש – החזרת תאום לפי ID

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING ✔️");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🔥 AURA BACKEND RUNNING ON PORT " + PORT);
});
