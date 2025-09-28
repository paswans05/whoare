import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Upload a face image
 * @param {Blob} file - Image file
 * @param {string} userId - Optional user ID
 * @returns {Promise<Object>}
 */
export async function uploadFace(file, userId = null) {
  const formData = new FormData();
  formData.append("image", file);
  if (userId) formData.append("userId", userId);

  const response = await axios.post(`${API_BASE}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data; // { faceId: ..., message: ... }
}

/**
 * Get status of face processing
 * @param {number|string} faceId
 * @returns {Promise<Object>}
 */
export async function getFaceStatus(faceId) {
  const response = await axios.get(`${API_BASE}/face/${faceId}`);
  return response.data; // { status: 'pending'|'processed'|'error'|'no_face', embedding: [...] }
}
