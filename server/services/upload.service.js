import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "civic_issues"
  });
  return result.secure_url;
};
