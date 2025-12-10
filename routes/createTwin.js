import express from "express";
import { supabase } from "../services/supabase.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, bio, user_id, image_url, audio_url } = req.body;

    if (!name || !bio || !user_id || !image_url || !audio_url) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const id = uuidv4();

    const { data, error } = await supabase
      .from("Aitwins")
      .insert({
        id,
        name,
        bio,
        user_id,
        image_url,
        audio_url
      })
      .select()
      .single();

    if (error) {
      console.error("CREATE TWIN ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Supabase error"
      });
    }

    return res.json({
      success: true,
      message: "Twin created",
      twin: data
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

export default router;
