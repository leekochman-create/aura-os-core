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
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const url = await uploadToSupabase("images", req.file);
    res.json({ url });
  } catch (err) {
    console.error("Upload image error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ====== UPLOAD AUDIO ======
router.post("/audio", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const url = await uploadToSupabase("audio", req.file);
    res.json({ url });
  } catch (err) {
    console.error("Upload audio error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ====== UPLOAD VIDEO ======
router.post("/video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const url = await uploadToSupabase("video", req.file);
    res.json({ url });
  } catch (err) {
    console.error("Upload video error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
