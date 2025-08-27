// FILE: src/middlewares/upload.js
// =============================
import multer from "multer";


const storage = multer.memoryStorage(); // keep in memory, we stream to Cloudinary


export const upload = multer({
storage,
limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});