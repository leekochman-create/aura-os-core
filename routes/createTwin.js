import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../supabaseClient.js";

const upload = multer();

const router = express.Router();

router.post("/createTwin", upload.fields([
  { name: "image_file", maxCount: 1 },
  { name: "audio_file", maxCount: 1 }
]), async (req, res) => {
  try {
    console.log("📥 Incoming CreateTwin:", req.body, req.files);

    const { name, bio, user_id } = req.body;

    if (!req.files.image_file || !req.files.audio_file) {
      return res.status(400).json({ error: "Missing uploads" });
    }

    const imageBuffer = req.files.image_file[0].buffer;
    const audioBuffer = req.files.audio_file[0].buffer;

    const twinId = uuidv4();

    const imagePath = `twins/images/${twinId}.png`;
    const audioPath = `twins/audio/${twinId}.mp3`;

    await supabase.storage.from("twins").upload(imagePath, imageBuffer, { contentType: "image/png" });
    await supabase.storage.from("twins").upload(audioPath, audioBuffer, { contentType: "audio/mpeg" });

    const imageUrl = supabase.storage.from("twins").getPublicUrl(imagePath).data.publicUrl;
    const audioUrl = supabase.storage.from("twins").getPublicUrl(audioPath).data.publicUrl;

    const { error } = await supabase.from("twins").insert({
      id: twinId,
      name,
      bio,
      user_id,
      image_url: imageUrl,
      audio_url: audioUrl
    });

    if (error) throw error;

    return res.json({ success: true, id: twinId });
  } catch (e) {
    console.error("❌ CreateTwin ERROR:", e);
    return res.status(500).json({ error: e.message });
  }
});

export default router;
