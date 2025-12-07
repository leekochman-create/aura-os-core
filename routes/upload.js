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

// Multer – קבלת קבצים בזיכרון
const storage = multer.memoryStorage();
const upload = multer({ storage });

// פונקציה העלאה לסופאבייס
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

/* ================================
   UPLOAD IMAGE
================================ */
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    console.log("📥 Incoming upload /image");
    console.log("📸 File received:", req.file);

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file provided" });
    }

    const url = await uploadToSupabase("images", req.file);

    res.json({ success: true, url });
  } catch (err) {
    console.error("❌ Upload image error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

/* ================================
   UPLOAD AUDIO
================================ */
router.post("/audio", upload.single("file"), async (req, res) => {
  try {
    console.log("🎤 Incoming upload /audio");
    console.log("📁 File:", req.file);

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file provided" });
    }

    const url = await uploadToSupabase("audio", req.file);
    res.json({ success: true, url });
  } catch (err) {
    console.error("❌ Upload audio error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

/* ================================
   UPLOAD VIDEO
================================ */
router.post("/video", upload.single("file"), async (req, res) => {
  try {
    console.log("🎬 Incoming upload /video");
    console.log("📁 File:", req.file);

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file provided" });
    }

    const url = await uploadToSupabase("video", req.file);
    res.json({ success: true, url });
  } catch (err) {
    console.error("❌ Upload video error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

export default router;
