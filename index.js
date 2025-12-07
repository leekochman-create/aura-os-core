import express from "express";
import cors from "cors";

// ==== ROUTES ====
import createTwinRoute from "./routes/createTwin.js";     // יצירת תאום
import speakRoute from "./routes/speak.js";               // יצירת קול OPENAI
import twinRoute from "./routes/twin.js";                 // קבלת תאום לפי ID
import uploadRoute from "./routes/upload.js";             // העלאת קבצים → תמונה/אודיו/וידאו

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== ROUTES ======
app.use("/createTwin", createTwinRoute);   // POST יצירת תאום
app.use("/speak", speakRoute);             // POST יצירת קול
app.use("/twin", twinRoute);               // GET תאום לפי ID
app.use("/upload", uploadRoute);           // POST העלאת קבצים ל-Supabase

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING ✔️");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🔥 AURA BACKEND RUNNING ON PORT " + PORT);
});
