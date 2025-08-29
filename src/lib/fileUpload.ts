// File upload utility for Express server
export const uploadFileToServer = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:3001/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'Upload failed');
  }

  // Return the full URL to the uploaded file
  return `http://localhost:3001${data.file.url}`;
};

// Alternative: Save to local storage (for demo)
export const saveFileToLocalStorage = (file: File): string => {
  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result as string;
    const fileId = `file_${Date.now()}_${file.name}`;
    localStorage.setItem(fileId, base64);
    return base64;
  };
  reader.readAsDataURL(file);
  return '';
};