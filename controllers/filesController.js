const prisma = require("../config/prismaClient");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.getAllFiles = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "You are unauthorized." });
  }
  const allFiles = await prisma.file.findMany({
    where: {
      userId: userId,
    },
  });
  return res.status(200).json(allFiles);
});

exports.getFileById = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "You are unauthorized." });
  }
  const { fileId } = req.params;
  const file = await prisma.file.findFirst({
    where: { id: fileId, userId: userId },
  });
  if (!file) {
    return res.status(404).json({ message: "File does not exists." });
  }
  res.status(201).json(file);
});

exports.createFile = [
  upload.single("file"), // middleware to handle file upload
  asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "You are unauthorized." });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check for specific image or video MIME types
    // Regex patterns for allowed image and video MIME types
    const imageMimeTypeRegex = /^image\/(jpeg|png|gif|webp|svg\+xml|tiff)$/;
    const videoMimeTypeRegex =
      /^video\/(mp4|x-matroska|quicktime|x-msvideo|webm|3gpp)$/;

    if (
      !imageMimeTypeRegex.test(req.file.mimetype) &&
      !videoMimeTypeRegex.test(req.file.mimetype)
    ) {
      return res.status(400).json({
        message: "Invalid file type. Only images and videos are allowed.",
      });
    }

    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: `${userId}/${req.file.originalname}`,
          folder: "imageBackup",
        },
        async (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to upload file" });
          }

          try {
            const newFile = await prisma.file.create({
              data: {
                name: req.file.originalname,
                url: result.secure_url,
                public_id: result.public_id,
                type: result.resource_type.toUpperCase(),
                userId: userId,
              },
            });
            res.status(201).json(newFile);
          } catch (dbError) {
            console.error(dbError);
            res.status(500).json({ message: "Error saving file data" });
          }
        }
      );

      // Write the buffer to the stream
      stream.end(req.file.buffer);
    } catch (error) {
      process.env.NODE_ENV && console.error(error);
      res.status(500).json({ message: "Error uploading file" });
    }
  }),
];

exports.deleteFile = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "You are unauthorized." });
  }
  const id = req.params.id;

  try {
    // Find the file in the database
    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(file.public_id, (error, result) => {
      if (error) {
        console.error("Cloudinary deletion error:", error);
        return res
          .status(500)
          .json({ message: "Failed to delete file from Cloudinary" });
      }
      console.log("Cloudinary deletion result:", result);
    });

    // Delete the file metadata from the database
    await prisma.file.delete({
      where: { id },
    });

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ message: "Error deleting file" });
  }
});
