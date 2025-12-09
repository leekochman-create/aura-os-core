import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// GET /twin?unique_id=xxxxxx
router.get("/", async (req, res) => {
  try {
    const { unique_id } = req.query;

    console.log("🔎 Fetching twin by unique_id:", unique_id);

    if (!unique_id) {
      return res.status(400).json({ error: "Missing unique_id" });
    }

    // Use maybeSingle to avoid errors when no rows returned
    const { data, error } = await supabase
      .from("aitwins")
      .select("*")
      .eq("unique_id", unique_id)
      .maybeSingle(); // ← prevents 'Cannot coerce' error

    if (error) {
      console.log("❌ Supabase Twin Error:", error);
      return res.status(500).json({ error: error.message });
    }

    // If no twin found
    if (!data) {
      console.log("⚠️ Twin not found in DB");
      return res.status(404).json({ error: "Twin not found" });
    }

    console.log("✅ Twin Fetch Successful:", data);

    return res.json({
      success: true,
      twin: data
    });

  } catch (err) {
    console.error("❌ Get Twin SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
