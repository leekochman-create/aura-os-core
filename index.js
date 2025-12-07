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

// ❗❗ חשוב: לא מפעילים express.json לפני מסלולי העלאת קבצים!
// אחרת multer לא יקבל את הקובץ.

// ====== ROUTES THAT RECEIVE FILES FIRST ======
app.use("/upload", uploadRoute);           // POST העלאת קבצים ל-Supabase

// ====== JSON ROUTES ======
// עכשיו מותר להפעיל JSON כי אין עוד מסלולים עם קבצים
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== OTHER ROUTES ======
app.use("/createTwin", createTwinRoute);   // POST יצירת תאום
app.use("/speak", speakRoute);             // POST יצירת קול
app.use("/twin", twinRoute);               // GET תאום לפי ID

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING ✔️");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🔥 AURA BACKEND RUNNING ON PORT " + PORT);
});
