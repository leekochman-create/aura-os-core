import express from "express";
import OpenAI from "openai";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/create", async (req, res) => {
  try {
    console.log("📥 Create Voice REQUEST:", req.body);

    const { twin_id, audio_url, name } = req.body;

    if (!twin_id || !audio_url || !name) {
      return res.status(400).json({
        error: "Missing twin_id, audio_url or name",
      });
    }

    // ===== 1. הורדת האודיו שהמשתמש העלה =====
    const audioFile = await axios.get(audio_url, {
      responseType: "arraybuffer",
    });

    // ===== 2. שליחה ל-OPENAI Training =====
    const voice_id = "voice_" + uuidv4();

    const upload = await openai.files.create({
      file: new Blob([audioFile.data]),
      purpose: "voice",
    });

    await openai.responses.create({
      model: "gpt-4o-audio-preview", // המודל ליצירת קול
      input: [
        {
          role: "system",
          content: `Create a voice profile named ${name}`,
        },
      ],
      audio: {
        voice: voice_id,
        voice_file_id: upload.id,
      },
    });

    console.log("🎤 OPENAI Voice Created:", voice_id);

    return res.status(200).json({
      success: true,
      voice_id,
    });
  } catch (err) {
    console.error("🔥 ERROR creating voice:", err.response?.data || err.message);
    return res.status(500).json({
      error: "Voice creation failed",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
