import express from "express";
import axios from "axios";
import FormData from "form-data";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    console.log("📥 Create Voice REQUEST:", req.body);

    const { twin_id, audio_url, name } = req.body;

    if (!twin_id || !audio_url || !name) {
      return res.status(400).json({
        error: "Missing twin_id, audio_url or name",
      });
    }

    console.log("⬇️ Downloading audio…");

    // 1) Download audio file Buffer
    const audioResponse = await axios.get(audio_url, {
      responseType: "arraybuffer",
    });

    const audioBuffer = audioResponse.data;

    console.log("🎙 Preparing FormData…");

    // 2) Create FormData with required fields
    const form = new FormData();

    form.append("name", name);           // REQUIRED
    form.append("description", name);    // optional but helps
    form.append("files", audioBuffer, {
      filename: `${name}.mp3`,
      contentType: "audio/mpeg",
    });

    console.log("📤 Sending to ElevenLabs…");

    // 3) Send to ElevenLabs
    const elevenResp = await axios.post(
      "https://api.elevenlabs.io/v1/voices/add",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
      }
    );

    const voice_id = elevenResp.data.voice_id;

    console.log("🎉 Voice created successfully:", voice_id);

    // 4) Response back to Bubble
    return res.status(200).json({
      success: true,
      voice_id,
      twin_id,
      name,
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
