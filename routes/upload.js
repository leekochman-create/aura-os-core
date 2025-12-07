import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const storage = multer.memoryStorage();
const upload = multer({ storage });

async function uploadToSupabase(folder, file) {
  console.log("⬆️ Uploading to Supabase...");

  const filename = `${uuidv4()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from("twins")
    .upload(`${folder}/${filename}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    console.error("❌ Supabase upload error:", error);
    throw error;
  }

  const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/twins/${folder}/${filename}`;
  console.log("✅ Supabase upload success:", publicUrl);

  return publicUrl;
}

router.post("/image", upload.single("file"), async (req, res) => {
  try {
    console.log("📥 Incoming upload /image");
    console.log("📸 File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file provided" });
    }

    const url = await uploadToSupabase("images", req.file);
    res.json({ success: true, url });
  } catch (err) {
    console.error("❌ Upload image error:", err);
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

export default router;
