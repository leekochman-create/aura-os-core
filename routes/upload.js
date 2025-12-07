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

// Upload function
async function uploadToSupabase(folder, file) {
  const filename = `${uuidv4()}-${file.originalname}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from("twins")
    .upload(`${folder}/${filename}`, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  // Fetch public URL
  const { data: publicData, error: urlError } = supabase.storage
    .from("twins")
    .getPublicUrl(`${folder}/${filename}`);

  if (urlError) throw urlError;

  console.log("✔️ Uploaded:", publicData.publicUrl);
  return publicData.publicUrl;
}

// ===========================
// IMAGE
// ===========================
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("NO_FILE");

    const url = await uploadToSupabase("images", req.file);

    // Bubble requires RAW URL — NOT JSON
    return res.status(200).send(url);

  } catch (err) {
    console.error("IMAGE ERROR:", err);
    return res.status(500).send("ERROR");
  }
});

// ===========================
// AUDIO
// ===========================
router.post("/audio", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("NO_FILE");

    const url = await uploadToSupabase("audio", req.file);

    return res.status(200).send(url);

  } catch (err) {
    console.error("AUDIO ERROR:", err);
    return res.status(500).send("ERROR");
  }
});

// ===========================
// VIDEO
// ===========================
router.post("/video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("NO_FILE");

    const url = await uploadToSupabase("video", req.file);

    return res.status(200).send(url);

  } catch (err) {
    console.error("VIDEO ERROR:", err);
    return res.status(500).send("ERROR");
  }
});

export default router;
