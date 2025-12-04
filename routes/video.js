import { generateHeyGenAvatar } from "../services/heygen.js";

export default async function video(req, res) {
  try {
    const { imageUrl, voice_id, text } = req.body;

    const data = await generateHeyGenAvatar(imageUrl, voice_id, text);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
