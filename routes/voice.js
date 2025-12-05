import express from "express";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import FormData from "form-data";

const router = express.Router();

// ===== Supabase =====
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ===== POST /voice/create =====
// Input: { twin_id, audio_url }
router.post("/create", async (req, res) => {
  try {
    console.log("🎤 Create Voice REQUEST:", req.body);

    const { twin_id, audio_url } = req.body;

    if (!twin_id || !audio_url) {
      return res.status(400).json({
        error: "Missing twin_id or audio_url",
      });
    }

    // ===== 1. Download audio file =====
    console.log("⬇ Downloading audio from:", audio_url);

    const audioResponse = await axios.get(audio_url, {
      responseType: "arraybuffer",
    });

    const audioBuffer = Buffer.from(audioResponse.data);

    // ===== 2. Upload to ElevenLabs Voice Cloning =====
    console.log("➡ Uploading to ElevenLabs...");

    const formData = new FormData();
    formData.append("audio", audioBuffer, {
      filename: "voice.mp3",
      contentType: "audio/mpeg",
    });

    const elevenRes = await axios.post(
      "https://api.elevenlabs.io/v1/voices/add",
      formData,
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          ...formData.getHeaders(),
        },
      }
    );

    const voice_id = elevenRes.data.voice_id;

    console.log("✅ Voice Created:", voice_id);

    // ===== 3. Save voice_id inside Supabase twins table =====
    await supabase
      .from("twins")
      .update({ voice_id })
      .eq("id", twin_id);

    // ===== 4. Return success =====
    return res.status(200).json({
      success: true,
      voice_id,
    });

  } catch (err) {
    console.error("🔥 Voice Create ERROR:", err.response?.data || err);
    return res.status(500).json({
      error: "Voice creation failed",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
