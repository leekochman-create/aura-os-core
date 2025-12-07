import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// יצירת חיבור לסופאבייס
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// הגדרת Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// פונקציה להעלאה לסופאבייס
async function uploadToSupabase(folder, file) {
  const filename = `${uuidv4()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("twins")
    .upload(`${folder}/${filename}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  return `${process.env.SUPABASE_URL}/storage/v1/object/public/twins/${folder}/${filename}`;
}

// ====== UPLOAD IMAGE ======
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file provided" });
    }

    const url = await uploadToSupabase("images", req.file);

    return res.status(200).json({
      success: true,
      file_url: url
    });

  } catch (err) {
    console.error("Upload image error:", err);
    return res.status(500).json({
      success: false,
      error: "Upload failed",
      details: err.message
    });
  }
});

// ====== UPLOAD AUDIO ======
router.post("/audio", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file provided" });
    }

    const url = await uploadToSupabase("audio", req.file);

    return res.status(200).json({
      success: true,
      file_url: url
    });

  } catch (err) {
    console.error("Upload audio error:", err);
    return res.status(500).json({
      success: false,
      error: "Upload failed",
      details: err.message
    });
  }
});

// ====== UPLOAD VIDEO ======
router.post("/video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file provided" });
    }

    const url = await uploadToSupabase("video", req.file);

    return res.status(200).json({
      success: true,
      file_url: url
    });

  } catch (err) {
    console.error("Upload video error:", err);
    return res.status(500).json({
      success: false,
      error: "Upload failed",
      details: err.message
    });
  }
});

export default router;
