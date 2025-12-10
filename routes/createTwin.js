import express from "express";
import { supabase } from "../services/supabase.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, bio, user_id, image_url, audio_url } = req.body;

    if (!name || !bio || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!image_url || !audio_url) {
      return res.status(400).json({ error: "Missing media URLs" });
    }

    const newTwin = {
      id: uuidv4(),
      name,
      bio,
      user_id,
      image_url,
      audio_url,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("Aitwins").insert(newTwin);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return res.status(500).json({ error: "Failed to create twin" });
    }

    return res.json({
      success: true,
      twin: newTwin,
    });
  } catch (e) {
    console.error("CREATE TWIN ERROR:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
