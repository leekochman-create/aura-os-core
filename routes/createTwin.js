import express from "express";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// ---- Supabase ----
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ---- Multer for file uploads ----
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===============================================
// POST /createTwin
// ===============================================
router.post(
  "/",
  upload.fields([
    { name: "image_file", maxCount: 1 },
    { name: "audio_file", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, bio, user_id } = req.body;

      if (!name || !bio || !user_id) {
        return res.status(400).json({
          error: "Missing required fields (name, bio, user_id)",
        });
      }

      // ===== Upload image =====
      let imageUrl = null;

      if (req.files?.image_file?.[0]) {
        const imgFile = req.files.image_file[0];

        const imgPath = `twins/${user_id}/image-${Date.now()}.png`;

        const { error: imgError } = await supabase.storage
          .from("twins")
          .upload(imgPath, imgFile.buffer, {
            contentType: imgFile.mimetype,
          });

        if (imgError) throw imgError;

        const { data: publicURL } = supabase.storage
          .from("twins")
          .getPublicUrl(imgPath);

        imageUrl = publicURL.publicUrl;
      }

      // ===== Upload audio =====
      let audioUrl = null;

      if (req.files?.audio_file?.[0]) {
        const audioFile = req.files.audio_file[0];

        const audioPath = `twins/${user_id}/audio-${Date.now()}.mp3`;

        const { error: audioError } = await supabase.storage
          .from("twins")
          .upload(audioPath, audioFile.buffer, {
            contentType: audioFile.mimetype,
          });

        if (audioError) throw audioError;

        const { data: publicAudioURL } = supabase.storage
          .from("twins")
          .getPublicUrl(audioPath);

        audioUrl = publicAudioURL.publicUrl;
      }

      // ===== Insert Twin into DB =====
      const { data: twin, error: tErr } = await supabase
        .from("twins")
        .insert([
          {
            user_id,
            name,
            bio,
            image_Url: imageUrl,  // ← EXACT כמו בסופאבייס
            audio_Url: audioUrl,  // ← EXACT כמו בסופאבייס
          },
        ])
        .select()
        .single();

      if (tErr) throw tErr;

      return res.status(200).json({
        success: true,
        twin,
      });
    } catch (err) {
      console.error("Create Twin Error:", err);
      return res.status(500).json({
        error: err.message || "Unknown server error",
      });
    }
  }
);

export default router;
