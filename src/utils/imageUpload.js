/**
 * Upload image to imgbb
 * Requires VITE_IMGBB_API_KEY in .env
 * Free key: https://api.imgbb.com/ -> Get API Key
 */
export const uploadImageToImgBB = async (file) => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("Image upload not configured. Please set VITE_IMGBB_API_KEY in .env or use Image URL.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Image upload failed");
  }
  return data.data.display_url; // or data.data.url
};

// Fallback: convert file to base64 for preview if needed (not for production, just fallback)
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
