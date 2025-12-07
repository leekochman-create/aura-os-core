async function uploadToSupabase(folder, file) {
  const filename = `${uuidv4()}-${file.originalname}`;

  // העלאה לבאקט
  const { data, error } = await supabase.storage
    .from("twins")
    .upload(`${folder}/${filename}`, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  // קבלת URL ציבורי אמיתי מסופבייס
  const { data: publicData, error: urlError } = supabase.storage
    .from("twins")
    .getPublicUrl(`${folder}/${filename}`);

  if (urlError) throw urlError;

  console.log("✔️ Upload success →", publicData.publicUrl);

  return publicData.publicUrl;
}
