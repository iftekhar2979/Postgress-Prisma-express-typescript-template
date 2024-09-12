import multer, { FileFilterCallback } from "multer";
import path from "path";
import config from "../config";
import { Request } from "express";
import createHttpError from "http-errors";

const UPLOAD_PATH = config.uploadFolder || "public/images/users";
const MAX_FILE_SIZE = Number(config.maxFileSize) || 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "jpg",
  "jpeg",
  "png",
  "xlsx",
  "xls",
  "csv",
  "pdf",
  "doc",
  "docx",
  "mp3",
  "wav",
  "ogg",
  "mp4",
  "avi",
  "mov",
  "mkv",
  "webm",
  "svg",
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const extName = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname.replace(
      extName,
      ""
    )}${extName}`;
    req.body.image = fileName;
    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  let extName = path.extname(file.originalname).toLocaleLowerCase();
  const isAllowedFileType = ALLOWED_FILE_TYPES.includes(extName);
  if (!isAllowedFileType) {
    return cb(createHttpError(400, "File type not allowed"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

export default upload