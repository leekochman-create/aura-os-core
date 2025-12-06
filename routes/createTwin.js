import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/**
 * POST /createTwin
 * יוצרת תאום חדש ומחזירה את אובייקט התאום ישירות (כדי שה-API של Bubble יעבוד)
 */
router.post("/", async (req, res) => {
  try {
    console.log("📥 Create Twin REQUEST:", req.body);

    const { name, bio, user_id, image_url, audio_url } = req.body;

    // ====== VALIDATION ======
    if (!name || !bio || !user_id) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!image_url || !audio_url) {
      console.log("❌ Missing media URLs");
      return res.status(400).json({ error: "Missing media URLs" });
    }

    // ====== CREATE TWIN OBJECT ======
    const twinId = uuidv4();

    const newTwin = {
      id: twinId,
      name,
      bio,
      user_id,
      image_url,
      audio_url,
      created_at: new Date().toISOString(),
    };

    console.log("✅ Twin Created Successfully:", newTwin);

    // 🔥 חשוב! מחזירים *רק* את התאום — ללא success וללא עטיפות
    return res.status(200).json(newTwin);

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

export default router;
