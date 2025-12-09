import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { id } = req.query;

    console.log("🔎 Fetching twin:", id);

    if (!id) {
      return res.status(400).json({ error: "Missing twin id" });
    }

    // Use maybeSingle to avoid errors when 0 rows returned
    const { data, error } = await supabase
      .from("aitwins")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.log("❌ Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      console.log("⚠️ Twin not found in database");
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
