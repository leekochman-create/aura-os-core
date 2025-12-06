import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    console.log("📥 OpenAI Voice Create REQUEST:", req.body);

    const { twin_id, name } = req.body;

    if (!twin_id || !name) {
      return res.status(400).json({
        error: "Missing twin_id or name",
      });
    }

    // === יצירת קול בסיסי ב-OpenAI ===
    const openaiResp = await axios.post(
      "https://api.openai.com/v1/audio/speech",
      {
        model: "gpt-4o-mini-tts",  // קיים ועובד
        voice: "alloy",            // קול בסיסי
        input: `Hello, this is the voice assigned to twin ${twin_id}.`, 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    console.log("🔊 OpenAI voice generated");

    // מחזיר אודיו בבסיס64 כדי שתוכל להשמיע מיידית
    const audioBase64 = Buffer.from(openaiResp.data).toString("base64");

    res.json({
      success: true,
      twin_id,
      voice_url: `data:audio/mp3;base64,${audioBase64}`,
      message: "OpenAI voice generated successfully",
    });
  } catch (err) {
    console.error("🔥 ERROR generating OpenAI voice:", err.response?.data || err);
    res.status(500).json({
      error: "Voice generation failed",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
