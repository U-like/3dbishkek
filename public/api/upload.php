<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
// Simple no-cache headers
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'error' => 'METHOD_NOT_ALLOWED']);
}

if (!isset($_FILES['file'])) {
    respond(400, ['success' => false, 'error' => 'NO_FILE']);
}

$file = $_FILES['file'];
if (!is_array($file) || !isset($file['error'])) {
    respond(400, ['success' => false, 'error' => 'INVALID_FILE_PAYLOAD']);
}

switch ($file['error']) {
    case UPLOAD_ERR_OK:
        break;
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        respond(413, ['success' => false, 'error' => 'FILE_TOO_LARGE']);
    case UPLOAD_ERR_PARTIAL:
        respond(400, ['success' => false, 'error' => 'PARTIAL_UPLOAD']);
    case UPLOAD_ERR_NO_FILE:
        respond(400, ['success' => false, 'error' => 'NO_FILE']);
    default:
        respond(400, ['success' => false, 'error' => 'UPLOAD_ERROR_' . (int)$file['error']]);
}

// Limits and whitelist
$maxSize = 25 * 1024 * 1024; // 25MB
if (!isset($file['size']) || (int)$file['size'] <= 0) {
    respond(400, ['success' => false, 'error' => 'INVALID_SIZE']);
}
if ((int)$file['size'] > $maxSize) {
    respond(413, ['success' => false, 'error' => 'FILE_TOO_LARGE']);
}

$originalName = isset($file['name']) ? (string)$file['name'] : 'file';
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

// Allowed extensions and some MIME checks
$allowedExts = [
    'stl','obj','dae','fbx',
    'zip','tar','rar','7z','7zip',
    'png','jpg','jpeg'
];
if (!in_array($ext, $allowedExts, true)) {
    respond(400, ['success' => false, 'error' => 'EXTENSION_NOT_ALLOWED']);
}

// Additional MIME validation (best-effort; some CAD files may be octet-stream)
$allowedMimes = [
    'image/png','image/jpeg',
    'application/zip','application/x-tar','application/x-rar-compressed','application/x-7z-compressed',
    'application/xml','text/xml','model/vnd.collada+xml',
    'application/octet-stream','text/plain','model/stl'
];

$tmpPath = $file['tmp_name'] ?? '';
if (!is_uploaded_file($tmpPath)) {
    respond(400, ['success' => false, 'error' => 'INVALID_TMP_FILE']);
}

$finfo = @finfo_open(FILEINFO_MIME_TYPE);
$mime = $finfo ? @finfo_file($finfo, $tmpPath) : 'application/octet-stream';
if ($finfo) {
    @finfo_close($finfo);
}
if ($mime === false || !is_string($mime) || $mime === '') {
    $mime = 'application/octet-stream';
}
// Only enforce MIME for known doc/image/archive; CAD files often show as octet-stream, which we allow
if (!in_array($mime, $allowedMimes, true)) {
    // Still allow if extension is CAD formats and mime is octet-stream/text/plain
    $cadExts = ['stl','obj','dae','fbx'];
    if (!(in_array($ext, $cadExts, true) && ($mime === 'application/octet-stream' || $mime === 'text/plain'))) {
        respond(400, ['success' => false, 'error' => 'MIME_NOT_ALLOWED', 'mime' => $mime]);
    }
}

// Prepare upload directory: public/uploads relative to this file (public/api/upload.php)
$uploadsDirFs = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'uploads';
if (!is_dir($uploadsDirFs)) {
    if (!@mkdir($uploadsDirFs, 0755, true) && !is_dir($uploadsDirFs)) {
        respond(500, ['success' => false, 'error' => 'FAILED_TO_CREATE_UPLOAD_DIR']);
    }
}

// Sanitize and generate unique filename
$base = preg_replace('/[^A-Za-z0-9._-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
$base = $base !== '' ? $base : 'file';
$base = substr($base, 0, 80);
try {
    $unique = bin2hex(random_bytes(4));
} catch (Throwable $e) {
    $unique = (string)mt_rand(100000, 999999);
}
$filename = date('Ymd_His') . '_' . $unique . '_' . $base . '.' . $ext;

$targetPath = $uploadsDirFs . DIRECTORY_SEPARATOR . $filename;
if (!@move_uploaded_file($tmpPath, $targetPath)) {
    respond(500, ['success' => false, 'error' => 'MOVE_FAILED']);
}

// Build public URL to the uploaded file
// If site is served from subdir (e.g. /site), script is /site/api/upload.php -> base becomes /site
$scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/'); // e.g. /site/api
$basePath = preg_replace('#/api$#', '', $scriptDir); // remove trailing /api
if ($basePath === null) { $basePath = ''; }
$url = rtrim($basePath, '/') . '/uploads/' . rawurlencode($filename);

respond(200, [
    'success' => true,
    'url' => $url,
    'name' => $originalName,
    'size' => (int)$file['size'],
    'mime' => $mime,
]);