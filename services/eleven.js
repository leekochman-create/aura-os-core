import axios from "axios";
import FormData from "form-data";

export const generateVoice = async (text, voiceId) => {
  const form = new FormData();
  form.append("text", text);

  const res = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    form,
    {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        ...form.getHeaders()
      },
      responseType: "arraybuffer"
    }
  );

  return res.data;
};
