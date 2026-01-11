import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  // Folder where images will be stored
  destination: './uploads/warehouses',
  filename: (req, file, cb) => {
    cb(null, `WHIMG-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const uploadWarehouseImages = multer({
  storage,
  fileFilter,
  // Max file size: 5MB per file and only 4
  limits: { files: 4, fileSize: 5 * 1024 * 1024 },
}).array('warehouseImages[]', 4);
