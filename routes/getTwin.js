import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

// GET /get_twin?unique_id=xxxxx
router.get("/", async (req, res) => {
  try {
    const { unique_id } = req.query;

    console.log("🔎 Fetching twin by unique_id:", unique_id);

    if (!unique_id) {
      return res.status(400).json({ error: "Missing unique_id" });
    }

    const { data, error } = await supabase
      .from("aitwins")
      .select("*")
      .eq("unique_id", unique_id)
      .maybeSingle(); // ← מונע את השגיאה שראית

    if (error) {
      console.log("❌ Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      console.log("⚠️ Twin not found");
      return res.status(404).json({ error: "Twin not found" });
    }

    console.log("✅ Twin Fetch Successful:", data);

    return res.json({
      success: true,
      twin: data,
    });
  } catch (err) {
    console.error("❌ Get Twin SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
