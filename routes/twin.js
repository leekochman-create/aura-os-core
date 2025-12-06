import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

/**
 * GET /twin?id=xxxx
 */
router.get("/", async (req, res) => {
  try {
    const twinId = req.query.id;

    if (!twinId) {
      return res.status(400).json({ error: "Missing twin id" });
    }

    // --- שורה אחת בלבד --- //
    const { data, error } = await supabase
      .from("twins")
      .select("*")
      .eq("id", twinId)
      .limit(1)     // תמיד מחזיר רק אופציה אחת
      .single();    // מכריח להחזיר אובייקט ולא רשימה

    if (error) {
      console.error("❌ Supabase Twin Error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Twin not found" });
    }

    return res.json(data);

  } catch (err) {
    console.error("🔥 Server Twin Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
