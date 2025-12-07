import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

async function uploadToSupabase(folder, file) {
  const filename = `${uuidv4()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("twins")
    .upload(`${folder}/${filename}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const publicUrl =
    `${process.env.SUPABASE_URL}/storage/v1/object/public/twins/${folder}/${filename}`;

  console.log(`✔️ Upload success → ${publicUrl}`);
  return publicUrl;
}

// ===============================
// IMAGE
// ===============================
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    console.log("📥 Upload IMAGE request");
    console.log("File:", req.file);

    if (!req.file) return res.status(400).json({ success: false, error: "No file" });

    const url = await uploadToSupabase("images", req.file);
    res.json({ success: true, url });
  } catch (err) {
    console.error("❌ Image upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// AUDIO
// ===============================
router.post("/audio", upload.single("file"), async (req, res) => {
  try {
    console.log("🎤 Upload AUDIO request");
    console.log("File:", req.file);

    if (!req.file) return res.status(400).json({ success: false, error: "No file" });

    const url = await uploadToSupabase("audio", req.file);
    res.json({ success: true, url });
  } catch (err) {
    console.error("❌ Audio upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// VIDEO
// ===============================
router.post("/video", upload.single("file"), async (req, res) => {
  try {
    console.log("🎬 Upload VIDEO request");
    console.log("File:", req.file);

    if (!req.file) return res.status(400).json({ success: false, error: "No file" });

    const url = await uploadToSupabase("video", req.file);
    res.json({ success: true, url });
  } catch (err) {
    console.error("❌ Video upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
