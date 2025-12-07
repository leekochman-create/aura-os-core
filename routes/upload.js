import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===============================
// Upload Helper
// ===============================
async function uploadToSupabase(folder, file) {
  const filename = `${uuidv4()}-${file.originalname}`;

  // Upload to bucket
  const { error: uploadError } = await supabase.storage
    .from("twins")
    .upload(`${folder}/${filename}`, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Public URL
  const { data: publicData, error: urlError } = supabase.storage
    .from("twins")
    .getPublicUrl(`${folder}/${filename}`);

  if (urlError) throw urlError;

  console.log("✔️ Upload success →", publicData.publicUrl);

  return publicData.publicUrl;
}

// ===============================
// IMAGE Upload
// ===============================
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    console.log("📥 Upload IMAGE request", req.file);

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file" });
    }

    const url = await uploadToSupabase("images", req.file);
    res.json({ success: true, url });

  } catch (err) {
    console.error("❌ Image upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// AUDIO Upload
// ===============================
router.post("/audio", upload.single("file"), async (req, res) => {
  try {
    console.log("🎤 Upload AUDIO request", req.file);

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file" });
    }

    const url = await uploadToSupabase("audio", req.file);
    res.json({ success: true, url });

  } catch (err) {
    console.error("❌ Audio upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// VIDEO Upload
// ===============================
router.post("/video", upload.single("file"), async (req, res) => {
  try {
    console.log("🎬 Upload VIDEO request", req.file);

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file" });
    }

    const url = await uploadToSupabase("video", req.file);
    res.json({ success: true, url });

  } catch (err) {
    console.error("❌ Video upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// EXPORT DEFAULT  ← ← הכי חשוב לתיקון השגיאה ב־Render!
// ===============================
export default router;
