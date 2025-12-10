import express from "express";
import { supabase } from "../services/supabase.js";

const router = express.Router();

router.get("/getTwin", async (req, res) => {
  try {
    const user_id = req.query.user_id;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
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

export default router;
