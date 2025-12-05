import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    console.log("📥 Create Voice REQUEST:", req.body);

    const { twin_id, audio_url } = req.body;

    if (!twin_id || !audio_url) {
      return res.status(400).json({ error: "Missing twin_id or audio_url" });
    }

    // ====== DOWNLOAD AUDIO FILE ======
    const audioResponse = await axios.get(audio_url, {
      responseType: "arraybuffer",
    });

    const audioBuffer = audioResponse.data;

    // ====== SEND AUDIO TO OPENAI WHISPER FOR VOICE EMBEDDING ======
    const openaiResp = await axios.post(
      "https://api.openai.com/v1/audio/embeddings",
      audioBuffer,
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "audio/mpeg"
        }
      }
    );

    const voice_vector = openaiResp.data.embedding;

    console.log("🎤 Voice Embedding Created:", voice_vector.length);

    // ====== RETURN RESULT ======
    res.status(200).json({
      success: true,
      twin_id,
      voice_vector
    });

  } catch (err) {
    console.error("🔥 Voice Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Voice creation failed",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
