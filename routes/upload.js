import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

  const { data: publicData } = supabase.storage
    .from("twins")
    .getPublicUrl(`${folder}/${filename}`);

  return publicData.publicUrl;
}

// ===============================
// IMAGE
// ===============================
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, error: "No file" });

    const url = await uploadToSupabase("images", req.file);

    // ✅ חייב להחזיר JSON ברור
    return res.json({ success: true, url });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// AUDIO
// ===============================
router.post("/audio", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, error: "No file" });

    const url = await uploadToSupabase("audio", req.file);

    return res.json({ success: true, url });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// VIDEO
// ===============================
router.post("/video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, error: "No file" });

    const url = await uploadToSupabase("video", req.file);

    return res.json({ success: true, url });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
