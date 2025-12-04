import { uploadToStorage } from "../utils/storage.js";

export default async function uploadImage(req, res) {
  try {
    const url = await uploadToStorage(
      req.file.buffer,
      req.file.originalname,
      "images"
    );

    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
