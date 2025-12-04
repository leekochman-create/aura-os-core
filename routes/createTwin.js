import { uploadToStorage } from "../utils/storage.js";
import { supabase } from "../services/supabase.js";

export default async function createTwin(req, res) {
  try {
    const { name, bio, user_id } = req.body;

    const imageFile = req.files.image_file?.[0];
    const audioFile = req.files.audio_file?.[0];

    const imageUrl = await uploadToStorage(imageFile.buffer, imageFile.originalname, "images");
    const audioUrl = await uploadToStorage(audioFile.buffer, audioFile.originalname, "audio");

    const { data, error } = await supabase
      .from("twins")
      .insert([{ name, bio, user_id, imageUrl, audioUrl }])
      .select()
      .single();

    if (error) throw error;

    res.json({
      status: "success",
      twin: data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
