import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const unique_id = req.query.unique_id;

    if (!unique_id) {
      return res.status(400).json({ error: "Missing unique_id parameter" });
    }

    const { data, error } = await supabase
      .from("twins")
      .select("*")
      .eq("unique_id", unique_id)
      .single();

    if (error) {
      console.error("❌ Supabase Twin Error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Twin not found" });
    }

    // 🔥 RETURN ONLY THE DATA — FLAT JSON
    return res.json(data);

  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
