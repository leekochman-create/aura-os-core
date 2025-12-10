import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../services/supabase.js";  // ← הייבוא הנכון

const upload = multer();

const router = express.Router();

router.post(
  "/createTwin",
  upload.fields([
    { name: "image_file", maxCount: 1 },
    { name: "audio_file", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log("📥 Incoming CreateTwin:", req.body, req.files);

      const { name, bio, user_id } = req.body;

      // Validate uploads
      if (!req.files.image_file || !req.files.audio_file) {
        return res.status(400).json({ error: "Missing uploads" });
      }

      // Read buffers
      const imageBuffer = req.files.image_file[0].buffer;
      const audioBuffer = req.files.audio_file[0].buffer;

      // Create ID
      const twinId = uuidv4();

      // Define paths
      const imagePath = `twins/images/${twinId}.png`;
      const audioPath = `twins/audio/${twinId}.mp3`;

      // Upload image
      const { error: imageError } = await supabase.storage
        .from("twins")
        .upload(imagePath, imageBuffer, {
          contentType: "image/png",
          upsert: false
        });

      if (imageError) {
        console.error("❌ Supabase image upload error:", imageError);
        throw imageError;
      }

      // Upload audio
      const { error: audioError } = await supabase.storage
        .from("twins")
        .upload(audioPath, audioBuffer, {
          contentType: "audio/mpeg",
          upsert: false
        });

      if (audioError) {
        console.error("❌ Supabase audio upload error:", audioError);
        throw audioError;
      }

      // Get public URLs
      const imageUrl = supabase.storage
        .from("twins")
        .getPublicUrl(imagePath).data.publicUrl;

      const audioUrl = supabase.storage
        .from("twins")
        .getPublicUrl(audioPath).data.publicUrl;

      // Insert into DB
      const { error: insertError } = await supabase
        .from("twins")
        .insert({
          id: twinId,
          name,
          bio,
          user_id,
          image_url: imageUrl,
          audio_url: audioUrl
        });

      if (insertError) throw insertError;

      return res.json({
        success: true,
        id: twinId,
        image_url: imageUrl,
        audio_url: audioUrl
      });
    } catch (e) {
      console.error("❌ CreateTwin ERROR:", e);
      return res.status(500).json({ error: e.message });
    }
  }
);

export default router;
