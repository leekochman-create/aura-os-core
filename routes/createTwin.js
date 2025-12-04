import fetch from "node-fetch";
import { supabase } from "../supabaseClient.js";

export default async function createTwin(req, res) {
  try {
    const { name, bio, user_id, image_file, audio_file } = req.body;

    // 1. הורדת הקובץ מה-URL שהגיע מ-Bubble
    async function downloadFile(url) {
      const response = await fetch(url);
      return Buffer.from(await response.arrayBuffer());
    }

    const imageBuffer = await downloadFile(image_file);
    const audioBuffer = await downloadFile(audio_file);

    // 2. העלאה ל-Supabase
    const imageName = `images/${Date.now()}-image.jpg`;
    const audioName = `audio/${Date.now()}-audio.mp3`;

    const { data: imageData, error: imageError } = await supabase.storage
      .from("public")
      .upload(imageName, imageBuffer, { contentType: "image/jpeg" });

    const { data: audioData, error: audioError } = await supabase.storage
      .from("public")
      .upload(audioName, audioBuffer, { contentType: "audio/mpeg" });

    if (imageError || audioError) {
      console.log(imageError || audioError);
      return res.status(500).json({ error: "Upload failed" });
    }

    const imageUrl = supabase.storage.from("public").getPublicUrl(imageName).data.publicUrl;
    const audioUrl = supabase.storage.from("public").getPublicUrl(audioName).data.publicUrl;

    // 3. שמירה במסד
    const { data, error } = await supabase.from("twins").insert([
      { name, bio, user_id, imageUrl, audioUrl }
    ]);

    if (error) return res.status(500).json({ error });

    return res.json({
      status: "success",
      twin: data[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
