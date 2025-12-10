import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user_id = req.query.user_id;

    if (!user_id) {
      return res.status(400).json({
        found: false,
        message: "Missing user_id",
        twin: null
      });
    }

    const { data, error } = await supabase
      .from("Aitwins")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error || !data) {
      return res.json({
        found: false,
        message: "Twin not found",
        twin: null
      });
    }

    return res.json({
      found: true,
      message: "Twin found",
      twin: {
        id: data.id,
        name: data.name,
        bio: data.bio,
        image_url: data.image_url,
        audio_url: data.audio_url,
        user_id: data.user_id,
        created_at: data.created_at
      }
    });

  } catch (err) {
    console.error("GET_TWIN ERROR:", err);
    return res.status(500).json({
      found: false,
      message: "Server error",
      twin: null
    });
  }
});

export default router;
