import { generateVoice } from "../services/eleven.js";

export default async function speak(req, res) {
  try {
    const { text, voice_id } = req.body;

    const audio = await generateVoice(text, voice_id);

    res.set("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
