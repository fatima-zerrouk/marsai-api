import multer from 'multer';

// On utilise le stockage en mémoire (MemoryStorage)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 Mo
  },
});

export default upload;
