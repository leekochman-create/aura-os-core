import express from "express";
import cors from "cors";

// ==== ROUTES ====
import createTwinRoute from "./routes/createTwin.js";
import chatRoute from "./routes/chat.js";
import speakRoute from "./routes/speak.js";
import uploadAudioRoute from "./routes/uploadAudio.js";
import uploadImageRoute from "./routes/uploadImage.js";
import videoRoute from "./routes/video.js";
import voiceRoute from "./routes/voice.js";   // <<< חדש

const app = express();

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ====== ROUTES ======
app.use("/createTwin", createTwinRoute);
app.use("/chat", chatRoute);
app.use("/speak", speakRoute);
app.use("/uploadAudio", uploadAudioRoute);
app.use("/uploadImage", uploadImageRoute);
app.use("/video", videoRoute);
app.use("/voice", voiceRoute);   // <<< חדש

// ====== TEST ROUTE ======
app.get("/", (req, res) => {
  res.send("AURA OS CORE API IS RUNNING ✔️");
});

// ====== START SERVER ======
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🔥 AURA BACKEND RUNNING ON PORT " + PORT);
});
