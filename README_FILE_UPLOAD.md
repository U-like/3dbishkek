# File Upload Feature for Chatbot

## 🚀 **Описание**
Функциональность загрузки файлов в чатбот с использованием Express + Multer сервера.

## 📋 **Возможности**
- ✅ Загрузка файлов через кнопку 📎
- ✅ Прогресс-бар загрузки с процентами
- ✅ Валидация размера файлов (макс 100MB)
- ✅ Поддержка 3D моделей (STL, OBJ, DAE)
- ✅ Поддержка изображений (PNG, JPG, JPEG)
- ✅ Поддержка архивов (ZIP, TAR, 7Z, RAR)
- ✅ Отображение файлов в чате
- ✅ Уведомления бота о загрузке

## 🛠 **Установка и запуск**

### 1. Установка зависимостей
```bash
pnpm install
```

### 2. Запуск сервера и фронтенда одновременно
```bash
pnpm run dev:full
```

### 3. Или запуск по отдельности
```bash
# Терминал 1: Запуск Express сервера
pnpm run server

# Терминал 2: Запуск React приложения
pnpm run dev
```

## 📁 **Структура проекта**
```
├── server/
│   ├── server.js          # Express сервер с Multer
│   └── uploads/           # Папка для загруженных файлов
├── src/
│   ├── lib/
│   │   └── fileUpload.ts  # Утилиты для загрузки файлов
│   └── components/
│       └── chat/
│           └── ChatDialog.tsx  # Обновленный компонент чата
```

## 🔧 **API Endpoints**

### POST `/api/upload`
Загрузка файла на сервер
- **Content-Type**: `multipart/form-data`
- **Параметр**: `file` - файл для загрузки
- **Ограничения**: макс 10MB, поддерживаемые типы файлов

**Пример ответа:**
```json
{
  "success": true,
  "message": "Файл успешно загружен",
  "file": {
    "originalName": "document.pdf",
    "filename": "document-1234567890.pdf",
    "size": 2048576,
    "mimetype": "application/pdf",
    "url": "/uploads/document-1234567890.pdf",
    "path": "server/uploads/document-1234567890.pdf"
  }
}
```

### GET `/uploads/:filename`
Скачивание загруженного файла

### GET `/api/health`
Проверка работоспособности сервера

## 🎯 **Использование**

1. **Открыть чат** - нажать на кнопку чата
2. **Выбрать файл** - нажать на кнопку 📎 и выбрать файл
3. **Загрузить файл** - нажать "Загрузить" в превью
4. **Просмотр прогресса** - отслеживать загрузку в реальном времени
5. **Получить уведомление** - бот подтвердит успешную загрузку

## 📋 **Поддерживаемые типы файлов**
- **3D модели**: `.stl`, `.obj`, `.dae`
- **Изображения**: `.png`, `.jpg`, `.jpeg`
- **Архивы**: `.zip`, `.tar`, `.7z`, `.rar`

## ⚙️ **Конфигурация**

### Ограничения файлов
```javascript
const limits = {
  fileSize: 100 * 1024 * 1024, // 100MB
};
```

### Разрешенные типы файлов
```javascript
const allowedTypes = [
  // Изображения
  'image/jpeg', 'image/jpg', 'image/png',
  // 3D модели
  'model/stl', 'application/sla', 'model/obj', 'application/x-tgif',
  // Архивы
  'application/zip', 'application/x-zip-compressed',
  'application/x-tar', 'application/x-7z-compressed',
  'application/x-rar-compressed', 'application/octet-stream'
];

// Дополнительная проверка по расширению
const allowedExtensions = ['.stl', '.obj', '.dae', '.zip', '.tar', '.7z', '.rar', '.png', '.jpg', '.jpeg'];
```

## 🔍 **Отладка**

### Логи сервера
Сервер выводит логи о загруженных файлах:
```
🚀 Server running on http://localhost:3001
📁 Uploads directory: /path/to/uploads
Файл загружен: document.pdf
```

### Проверка API
```bash
curl http://localhost:3001/api/health
```

## 🚀 **Продакшн**

Для продакшена:
1. Настроить переменные окружения
2. Использовать облачное хранилище (AWS S3, Cloudinary)
3. Добавить аутентификацию
4. Настроить CORS для домена

## 📞 **Поддержка**
При возникновении проблем проверьте:
- ✅ Сервер запущен на порту 3001
- ✅ Папка `server/uploads` существует
- ✅ Файл не превышает 100MB
- ✅ Тип файла поддерживается