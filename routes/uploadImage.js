import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// הגדרת Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /upload/image
router.post("/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Missing file" });

    const filename = `${uuidv4()}-${req.file.originalname}`;

    const { data, error } = await supabase.storage
      .from("twins")
      .upload(`images/${filename}`, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }

    const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/twins/images/${filename}`;

    return res.json({ url: publicURL });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server failed during upload" });
  }
});

export default router;
