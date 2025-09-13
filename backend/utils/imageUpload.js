const cloudinary = require("cloudinary").v2
const multer = require("multer")

// Configure Cloudinary
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// Upload image to Cloudinary
const uploadToCloudinary = (buffer, folder = "waste-management") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder,
          transformation: [{ width: 800, height: 600, crop: "limit", quality: "auto" }],
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            })
          }
        },
      )
      .end(buffer)
  })
}

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    throw error
  }
}

// Configure multer for image uploads
const configureMulter = (maxFiles = 5, maxSize = 5 * 1024 * 1024) => {
  const storage = multer.memoryStorage()

  return multer({
    storage,
    limits: {
      fileSize: maxSize,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true)
      } else {
        cb(new Error("Only image files are allowed"), false)
      }
    },
  })
}

module.exports = {
  configureCloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  configureMulter,
}
