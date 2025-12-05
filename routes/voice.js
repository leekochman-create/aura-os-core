import express from "express";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    console.log("📥 Create Voice REQUEST:", req.body);

    const { twin_id, audio_url } = req.body;

    if (!twin_id || !audio_url) {
      return res.status(400).json({ error: "Missing twin_id or audio_url" });
    }

    // ====== DOWNLOAD AUDIO ======
    const audioResponse = await axios.get(audio_url, {
      responseType: "arraybuffer",
    });

    const audioBuffer = audioResponse.data;

    // ====== SEND TO ELEVENLABS ======
    const elevenResp = await axios.post(
      "https://api.elevenlabs.io/v1/voices/add",
      audioBuffer,
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "audio/mpeg",
        },
      }
    );

    const voice_id = elevenResp.data.voice_id;

    console.log("🎤 Voice Created:", voice_id);

    // ====== RETURN RESULT ======
    res.status(200).json({
      success: true,
      voice_id,
      twin_id,
    });
  } catch (err) {
    console.error("🔥 ERROR creating voice:", err.response?.data || err);
    res.status(500).json({
      error: "Voice creation failed",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
