import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// GET /twin?id=xxxx
router.get("/", async (req, res) => {
  try {
    const twinId = req.query.id;

    if (!twinId) {
      return res.status(400).json({ error: "Missing twin ID" });
    }

    const { data, error } = await supabase
      .from("twins")
      .select("*")
      .eq("id", twinId)
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Twin not found" });
    }

    console.log("📤 Twin fetched:", data);
    res.json(data);

  } catch (err) {
    console.error("❌ GET Twin Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
