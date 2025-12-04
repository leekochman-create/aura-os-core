import axios from "axios";

export const generateHeyGenAvatar = async (imageUrl, voiceId, text) => {
  const res = await axios.post(
    "https://api.heygen.com/v1/video.generate",
    {
      image_url: imageUrl,
      voice_id: voiceId,
      text
    },
    {
      headers: { "X-Api-Key": process.env.HEYGEN_API_KEY }
    }
  );

  return res.data;
};
