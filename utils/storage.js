import { supabase } from "../services/supabase.js";
import { randomUUID } from "crypto";

export const uploadToStorage = async (fileBuffer, fileName, bucket) => {
  const path = `${randomUUID()}-${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, fileBuffer, { contentType: "application/octet-stream" });

  if (error) throw error;

  const { publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(path).data;

  return publicUrl;
};
