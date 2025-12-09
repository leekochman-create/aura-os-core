import express from "express";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📥 Create Twin REQUEST BODY:", req.body);

    const { name, bio, user_id, image_url, audio_url } = req.body;

    // Validation
    if (!name || !bio || !user_id || !image_url || !audio_url) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    // Generate ID
    const twinId = uuidv4();

    const newTwin = {
      id: twinId,
      unique_id: twinId,
      name,
      bio,
      user_id,
      image_url,
      audio_url,
      created_at: new Date().toISOString()
    };

    console.log("📦 Twin to Insert:", newTwin);

    // Insert to Supabase
    const { data, error } = await supabase
      .from("aitwins")
      .insert([newTwin])
      .select()
      .single();

    if (error) {
      console.log("❌ Supabase Insert Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    console.log("✅ Twin Saved to Supabase:", data);

    // Return clean JSON object
    return res.json({
      success: true,
      twin_id: data.id,
      twin_unique_id: data.unique_id,
      twin_name: data.name,
      twin_bio: data.bio,
      twin_user_id: data.user_id,
      twin_image_url: data.image_url,
      twin_audio_url: data.audio_url,
      created_at: data.created_at
    });

  } catch (err) {
    console.error("❌ Create Twin SERVER ERROR:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
