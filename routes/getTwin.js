import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

router.get(["/", ""], async (req, res) => {
  try {
    const user_id = req.query.user_id;

    // מאפשר לבאבל לעשות Initialize
    if (!user_id) {
      return res.json({
        found: false,
        message: "No user_id provided",
        sample: {
          id: "12345",
          name: "Sample Twin",
          bio: "Example bio for Bubble initialize",
        },
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
      });
    }

    return res.json({
      found: true,
      twin: data,
    });

  } catch (e) {
    console.error("GET_TWIN ERROR:", e);
    return res.status(500).json({ error: "Server error" });
  }
});

// ❗ חשוב! זה מה שחסר לפי Render
export default router;
