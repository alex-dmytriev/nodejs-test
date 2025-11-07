import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // store a file in the server RAM
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 Mb limit
  fileFilter: (req, file, cb) => {
    // Checks if it's an image file, if not cb (callback) throws an error
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'));
    }

    cb(null, true); // callback to accept a file
  },
});
