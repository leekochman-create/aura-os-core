import express from "express";
import OpenAI from "openai";

const router = express.Router();

// יצירת לקוח OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    console.log("📥 Speak REQUEST:", req.body);

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    // ====== יצירת אודיו ======
    const response = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
      format: "mp3",
    });

    // התשובה חוזרת כ־ArrayBuffer
    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });

    return res.send(audioBuffer);
  } catch (err) {
    console.error("🔥 ERROR in /speak:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
