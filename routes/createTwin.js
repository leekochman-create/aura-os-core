import express from "express";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// ========== INIT SUPABASE ==========
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ========== CREATE TWIN ==========
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

    // צור ID מקומי
    const twinId = uuidv4();

    // ====== INSERT INTO SUPABASE ======
    const { data, error } = await supabase
      .from("twins")
      .insert([
        {
          id: twinId,
          name,
          bio,
          user_id,
          image_url,
          audio_url,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase Insert Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Twin Saved to DB:", data);

    // ====== RETURN RESPONSE TO BUBBLE ======
    return res.status(200).json({
      success: true,
      twin: data, // ← זה מה שבאבל צריך
    });

  } catch (err) {
    console.error("🔥 SERVER ERROR:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

export default router;
