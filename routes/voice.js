import express from "express";
import axios from "axios";
import FormData from "form-data";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// === Supabase ===
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// === ElevenLabs ===
const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;

router.post("/create", async (req, res) => {
  try {
    console.log("🎤 Voice Create REQUEST:", req.body);

    const { twin_id, audio_url } = req.body;

    if (!twin_id || !audio_url) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // 1️⃣ Download audio file
    const audioFile = await axios.get(audio_url, { responseType: "arraybuffer" });

    // 2️⃣ Send to ElevenLabs Voice Cloning
    const formData = new FormData();
    formData.append("name", `voice_${twin_id}`);
    formData.append("files", Buffer.from(audioFile.data), {
      filename: "voice_sample.mp3",
      contentType: "audio/mpeg",
    });

    const elevenRes = await axios.post(
      "https://api.elevenlabs.io/v1/voices/add",
      formData,
      {
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          ...formData.getHeaders(),
        },
      }
    );

    const voice_id = elevenRes.data.voice_id;
    console.log("✅ ElevenLabs Voice Created:", voice_id);

    // 3️⃣ Save voice_id to Supabase
    await supabase
      .from("twins")
      .update({ voice_id })
      .eq("id", twin_id);

    return res.json({
      success: true,
      voice_id,
      message: "Voice cloned successfully",
    });
  } catch (err) {
    console.error("🔥 Voice Clone ERROR:", err.response?.data || err);
    return res.status(500).json({
      error: "Voice cloning failed",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
