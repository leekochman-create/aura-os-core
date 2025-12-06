import express from "express";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../services/supabase.js";

const router = express.Router();

/**
 * POST /createTwin
 */
router.post("/", async (req, res) => {
  try {
    console.log("📥 Create Twin REQUEST:", req.body);

    const { name, bio, user_id, image_url, audio_url } = req.body;

    // ====== VALIDATION ======
    if (!name || !bio || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!image_url || !audio_url) {
      return res.status(400).json({ error: "Missing media URLs" });
    }

    // ====== CREATE STRUCTURED TWIN ======
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

    // ====== SAVE TO SUPABASE ======
    const { data, error } = await supabase
      .from("twins")
      .insert([newTwin])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase Insert Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Twin Saved to Supabase:", data);

    // 🔥 מחזירים לבאבל אובייקט אחד נקי
    return res.status(200).json(data);

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

export default router;
