import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SERVICE_ROLE!;
export const supabase = createClient(supabaseUrl, supabaseKey);

const base64ToBlob = (base64String: string, contentType: string) => {
  const byteCharacters = atob(base64String.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

export const uploadImage = async (
  base64String: string,
  filePath: string
): Promise<string | null> => {
  const contentType = "image/png";
  const blob = base64ToBlob(base64String, contentType);

  // Listar los buckets disponibles
  const { data: buckets, error: bucketsError } =
    await supabase.storage.listBuckets();
  if (bucketsError) {
    console.error("Error al listar los buckets:", bucketsError);
    throw bucketsError;
  }
  console.log("Buckets disponibles:", buckets);

  const { data, error } = await supabase.storage
    .from("myb_hidraulic")
    .upload(`${filePath}.png`, blob, {
      contentType,
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("myb_hidraulic").getPublicUrl(`${filePath}.png`);
  return publicUrl;
};
