import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Создаем папку для загрузок если её нет
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Настройка Multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  }
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  // Разрешенные типы файлов
  const allowedTypes = [
    // Изображения
    'image/jpeg',
    'image/jpg',
    'image/png',
    // 3D модели
    'model/stl',
    'application/sla',
    'model/obj',
    'application/x-tgif',
    // Архивы
    'application/zip',
    'application/x-zip-compressed',
    'application/x-tar',
    'application/x-7z-compressed',
    'application/x-rar-compressed',
    'application/octet-stream' // для .7z, .rar, .tar
  ];

  // Дополнительная проверка по расширению файла
  const allowedExtensions = ['.stl', '.obj', '.dae', '.zip', '.tar', '.7z', '.rar', '.png', '.jpg', '.jpeg'];
  const fileExtension = '.' + file.originalname.split('.').pop()?.toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Неподдерживаемый тип файла: ${file.mimetype} (${fileExtension})`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  }
});

// API endpoint для загрузки файлов
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не найден'
      });
    }

    // Возвращаем информацию о загруженном файле
    const fileInfo = {
      success: true,
      message: 'Файл успешно загружен',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/uploads/${req.file.filename}`,
        path: req.file.path
      }
    };

    console.log('Файл загружен:', fileInfo.file.originalName);
    res.json(fileInfo);

  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке файла',
      error: error.message
    });
  }
});

// Endpoint для скачивания файлов
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({
      success: false,
      message: 'Файл не найден'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Обработка ошибок Multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Файл слишком большой. Максимальный размер: 100MB'
      });
    }
  }

  if (error.message === 'Неподдерживаемый тип файла') {
    return res.status(400).json({
      success: false,
      message: 'Неподдерживаемый тип файла'
    });
  }

  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
});