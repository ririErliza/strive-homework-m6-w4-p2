import multer from "multer"
import { v2 as cloudinary } from "cloudinary" // to find credentials (CLOUDINARY_URL) from process.env
import { CloudinaryStorage } from "multer-storage-cloudinary" // multer plugin used to tell multer to save files on cloudinary
import createError from "http-errors"

export const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "modul6",
    },
  }),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, multerNext) => {
    if ( file.mimetype !== 'image/png' && file.mimetype !== 'image/gif' && file.mimetype !== 'image/jpeg') {
      return multerNext(createError(400, "Only GIFs or JPEG/JPGs are allowed!"))
    } else {
      multerNext(null, true)
    }
  },
}).single("folder1")

