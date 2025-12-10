import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

router.get("/getTwin", async (req, res) => {
  try {
    const user_id = req.query.user_id;

    console.log("🔥 GET TWIN REQUEST | user_id:", user_id);

    if (!user_id) {
      console.log("❌ Missing user_id");
      return res.status(400).json({ error: "Missing user_id" });
    }

    console.log("🔎 Fetching from Supabase → twins where user_id =", user_id);

    const { data, error } = await supabase
      .from("twins")           // 🔥 הטבלה הנכונה
      .select("*")
      .eq("user_id", user_id)
      .limit(1);

    console.log("📌 Supabase result:", data, error);

    if (error) {
      console.log("❌ Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      console.log("⚠️ Twin NOT FOUND for user:", user_id);
      return res.json({
        found: false,
        message: "Twin not found",
        twin: null
      });
    }

    console.log("✅ Twin FOUND:", data[0]);

    return res.json({
      found: true,
      twin: data[0],
    });

  } catch (err) {
    console.error("🔥 UNEXPECTED GET_TWIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
