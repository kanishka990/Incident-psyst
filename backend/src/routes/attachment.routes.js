import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { 
  getAttachments, 
  uploadAttachment, 
  downloadAttachment, 
  deleteAttachment 
} from "../controllers/attachment.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

// Get attachments for an incident - mounted at /api/incidents/:incidentId/attachments
router.get("/:incidentId/attachments", authenticateToken, getAttachments);

// Upload attachment - mounted at /api/incidents/:incidentId/attachments
router.post("/:incidentId/attachments", authenticateToken, upload.single("file"), uploadAttachment);

// Download attachment - mounted at /api/attachments/:attachmentId/download
router.get("/:attachmentId/download", authenticateToken, downloadAttachment);

// Delete attachment - mounted at /api/attachments/:attachmentId
router.delete("/:attachmentId", authenticateToken, deleteAttachment);

export default router;
