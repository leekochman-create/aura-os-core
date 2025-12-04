import { askOpenAI } from "../services/openai.js";

export default async function chat(req, res) {
  try {
    const { message } = req.body;
    const reply = await askOpenAI(message);

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
