import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

import createTwin from "./routes/createTwin.js";
import uploadImage from "./routes/uploadImage.js";
import uploadAudio from "./routes/uploadAudio.js";
import chat from "./routes/chat.js";
import speak from "./routes/speak.js";
import video from "./routes/video.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer – עיבוד קבצים
const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.post("/create_twin", upload.fields([{ name: "image_file" }, { name: "audio_file" }]), createTwin);
app.post("/upload/image", upload.single("image_file"), uploadImage);
app.post("/upload/audio", upload.single("audio_file"), uploadAudio);
app.post("/chat", chat);
app.post("/speak", speak);
app.post("/video", video);

app.get("/", (req, res) => {
  res.send("AURA OS CORE API RUNNING");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`AURA BACKEND RUNNING ON PORT ${port}`));
