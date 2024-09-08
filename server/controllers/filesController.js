import prisma from "../config/prismaClient.js";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";
import { errorHandler } from "../utils/errorHandler.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const getAllFiles = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(errorHandler(401, "Unauthorized"));
  }
  const type = req.query.type ? req.query.type.toUpperCase() : null;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const whereClause = {
    userId: userId,
  };

  if (type) {
    whereClause.type = type;
  }

  try {
    const [allFiles, totalFiles] = await Promise.all([
      prisma.file.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc", // or 'asc'
        },
      }),
      prisma.file.count({
        where: whereClause,
      }),
    ]);
    const totalPages = Math.ceil(totalFiles / limit);
    return res.status(200).json({
      files: allFiles,
      totalFiles,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export const getFileById = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(errorHandler(401, "Unauthorized"));
  }
  const { fileid } = req.params;
  try {
    const file = await prisma.file.findFirst({
      where: {
        id: fileid,
      },
    });
    if (!file) {
      return next(errorHandler(404, "File not found"));
    }
    return res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};

export const createFile = [
  upload.single("file"),
  async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(errorHandler(401, "Unauthorized"));
    }
    try {
      if (!req.file) {
        return next(errorHandler(400, "No file uploaded"));
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
        return next(
          errorHandler(
            400,
            "Invalid file type. Only images and videos are supported"
          )
        );
      }
      //Upload to cloudinary
      try {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            public_id: `${userId}/${req.file.originalname}`,
            folder: "imageBackup",
          },
          async (error, result) => {
            if (error) {
              process.env.NODE_ENV === "production" &&
                console.log("Error uploading to cloudinary");
              return next(errorHandler(500, "Failed to upload to cloudinary"));
            }
            try {
              const newFile = await prisma.file.create({
                data: {
                  name: req.file.originalname,
                  url: result.secure_url,
                  public_id: result.public_id,
                  type: result.resource_type.toUpperCase(),
                  userId: userId,
                  createdAt: new Date(),
                },
              });
              return res
                .status(200)
                .json({ message: "File uploaded", file: newFile });
            } catch (error) {
              console.log("Error uploading to database");
              return next(500, "Error uploading file to database");
            }
          }
        );
        // Write the buffer to the stream
        stream.end(req.file.buffer);
      } catch (error) {
        return next(errorHandler(500, "Error uploading file to cloudinary"));
      }
    } catch (error) {
      next(error);
    }
  },
];

export const deleteFile = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return next(errorHandler(401, "Unauthorized to delete"));
  }
  const fileid = req.params?.fileid;
  try {
    // Find the file in the database
    const file = await prisma.file.findUnique({
      where: { id: fileid },
    });

    if (!file) {
      return next(errorHandler(401, "File not found"));
    }

    // Determine the resource type
    const resourceType = file.type === "VIDEO" ? "video" : "image";

    await cloudinary.uploader.destroy(file.public_id, (error, result) => {
      if (error) {
        console.log("Cloudinary deletion error: ", error);
        return next(errorHandler(500, "Failed to delete file from Cloudinary"));
      }
      console.log("Cloudinary deletion result:", result);
    });
    const fileDeleted = await prisma.file.delete({
      where: {
        id: fileid,
      },
    });
    return res.status(200).json(fileDeleted);
  } catch (error) {
    next(error);
  }
};
