import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/createTwin", async (req, res) => {
  try {
    console.log("📥 Create Twin REQUEST:", req.body);

    const { name, bio, user_id, image_file, audio_file } = req.body;

    // ====== VALIDATION ======
    if (!name || !bio || !user_id) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!image_file || !audio_file) {
      console.log("❌ Missing media URLs");
      return res.status(400).json({ error: "Missing media URLs" });
    }

    // ====== STRUCTURED TWIN DATA ======
    const twinId = uuidv4();

    const newTwin = {
      id: twinId,
      name,
      bio,
      user_id,
      image_url: image_file,   // <–– URL בלבד
      audio_url: audio_file,   // <–– URL בלבד
      created_at: new Date().toISOString()
    };

    console.log("✅ Twin Created:", newTwin);

    // ====== RETURN SUCCESS ======
    return res.status(200).json({
      success: true,
      twin: newTwin
    });

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
});

export default router;
