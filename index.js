import express from "express";
import cors from "cors";

// ==== ROUTES ==== 
import createTwinRoute from "./routes/createTwin.js";
import speakRoute from "./routes/speak.js";
import twinRoute from "./routes/twin.js";
import uploadRoute from "./routes/upload.js";

const app = express();

// ====== CORS ======
app.use(cors());

// ❗ חשוב: upload לפני JSON אחרת הקבצים לא יתקבלו
app.use("/upload", uploadRoute);

// ====== JSON ======
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== API ROUTES ======
app.use("/createTwin", createTwinRoute);
app.use("/speak", speakRoute);
app.use("/twin", twinRoute);

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING ✔️");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🔥 AURA BACKEND RUNNING ON PORT " + PORT);
});
