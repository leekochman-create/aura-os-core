import express from "express";
import cors from "cors";

// ==== ROUTES ====
import createTwinRoute from "./routes/createTwin.js";
import chatRoute from "./routes/chat.js";
import speakRoute from "./routes/speak.js";
import uploadAudioRoute from "./routes/uploadAudio.js";
import uploadImageRoute from "./routes/uploadImage.js";
import videoRoute from "./routes/video.js";
import voiceRoute from "./routes/voice.js";   // ⭐ חדש — יצירת קול באילבן

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== ROUTES ======
app.use("/createTwin", createTwinRoute);        // יצירת תאום
app.use("/voice", voiceRoute);                 // ⭐ יצירת קול ElevenLabs
app.use("/chat", chatRoute);                   // צ'אט AI
app.use("/speak", speakRoute);                 // דיבור AI
app.use("/uploadAudio", uploadAudioRoute);     // העלאת אודיו
app.use("/uploadImage", uploadImageRoute);     // העלאת תמונה
app.use("/video", videoRoute);                 // יצירת וידאו AI

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AURA BACKEND RUNNING ON PORT " + PORT);
});
