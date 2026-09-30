import fs from "fs";
import path from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env";
import { AppError } from "../../common/errors/app-error";
import { ERROR_CODES } from "../../common/constants/error-codes";

export interface StorageService {
  upload(
    file: Express.Multer.File,
    folder: string
  ): Promise<{
    url: string;
    publicId?: string;
  }>;

  delete(publicId: string): Promise<void>;
}

// Cloudinary storage implementation
class CloudinaryStorageService implements StorageService {
  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: string
  ): Promise<{ url: string; publicId?: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `sakan/${folder}`,
          resource_type: "auto"
        },
        (error, result) => {
          if (error || !result) {
            return reject(new AppError(ERROR_CODES.UPLOAD_FAILED, 500));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err);
    }
  }
}

// Local storage implementation fallback
class LocalStorageService implements StorageService {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), "uploads");
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async upload(
    file: Express.Multer.File,
    folder: string
  ): Promise<{ url: string; publicId?: string }> {
    const targetFolder = path.join(this.baseDir, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const ext = path.extname(file.originalname) || ".jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(targetFolder, filename);

    await fs.promises.writeFile(filePath, file.buffer);

    const publicId = `${folder}/${filename}`;
    const url = `/uploads/${folder}/${filename}`;

    return {
      url,
      publicId
    };
  }

  async delete(publicId: string): Promise<void> {
    const filePath = path.join(this.baseDir, publicId);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath).catch(() => {});
    }
  }
}

// Use Cloudinary if keys are provided, else fallback to Local storage
export const storageService: StorageService =
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
    ? new CloudinaryStorageService()
    : new LocalStorageService();

// Multer memory storage configuration for file uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError(ERROR_CODES.UPLOAD_FAILED, 400));
    }
  }
});
