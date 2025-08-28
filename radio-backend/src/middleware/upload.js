import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (_req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, '-');
        cb(null, `${Date.now()}-${base}${ext}`);
    }
});


export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPG, PNG, WEBP allowed'));
    }
});