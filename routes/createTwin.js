import express from "express";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../services/supabase.js";

const router = express.Router();

/**
 * POST /createTwin
 */
router.post("/", async (req, res) => {
  try {
    console.log("📥 Create Twin REQUEST BODY:", req.body);

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

    // ====== GENERATE UNIQUE TWIN ID ======
    const twinId = uuidv4();
    console.log("🆔 Generated twinId:", twinId);

    // ====== TWIN OBJECT ======
    const newTwin = {
      id: twinId,
      unique_id: twinId, // ← חייב להיות זהה ל-ID שהדף יקבל
      name,
      bio,
      user_id,
      image_url,
      audio_url,
      created_at: new Date().toISOString(),
    };

    console.log("📦 Twin to Insert:", newTwin);

    // ====== SAVE TO SUPABASE ======
    const { data, error } = await supabase
      .from("twins")
      .insert([newTwin])
      .select()
      .single();

    if (error) {
      console.log("❌ Supabase Insert Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Twin Saved to Supabase:", data);

    // ====== RETURN CLEAN OBJECT TO BUBBLE ======
    return res.status(200).json({
      success: true,
      twin: data, // Bubble יקבל את ה-ID ישירות בתוך twin.id
    });

  } catch (err) {
    console.log("🔥 SERVER ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

export default router;
