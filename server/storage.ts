import { supabaseAdmin } from "./_core/supabase";
import { nanoid } from "nanoid";

const BUCKET_NAME = "uploads";

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const uniqueKey = `${nanoid(8)}_${key}`;

  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as BlobPart], { type: contentType });

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(uniqueKey, blob, { contentType, upsert: true });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(uniqueKey);

  return { key: uniqueKey, url: publicUrlData.publicUrl };
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(key);

  return { key, url: publicUrlData.publicUrl };
}
