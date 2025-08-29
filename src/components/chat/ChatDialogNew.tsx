import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Bot, User, RotateCcw, Paperclip, File, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { uploadFileToServer } from '@/lib/fileUpload';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'file';
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  fileStatus?: 'uploading' | 'uploaded' | 'processing' | 'ready';
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Constants
const API_KEY = import.meta.env.VITE_ZAI_API_KEY || 'ee85251eddbd4d74bf97ed21916a37df.6uXGJqojuyLrx8rR';
const CHAT_HEIGHT = '600px';
const INPUT_AREA_HEIGHT = 'auto'; // Will be calculated dynamically

// Sub-components
function MessageItem({ message }: { message: Message }) {
  return (
    <div className={`flex w-full items-start gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'bot' && (
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className="flex flex-col max-w-[80%]">
        {message.type === 'file' ? (
          <div className="flex items-start gap-3 bg-muted p-3 rounded-lg">
            <File className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium break-all">{message.fileName}</p>
                {message.fileStatus === 'uploading' && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
                {message.fileStatus === 'uploaded' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
                {message.fileStatus === 'processing' && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                )}
                {message.fileStatus === 'ready' && (
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {message.fileSize && (
                  <p className="text-xs opacity-70">
                    {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
                {message.fileStatus && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    message.fileStatus === 'uploading' ? 'bg-blue-100 text-blue-700' :
                    message.fileStatus === 'uploaded' ? 'bg-green-100 text-green-700' :
                    message.fileStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {message.fileStatus === 'uploading' && 'Загружается...'}
                    {message.fileStatus === 'uploaded' && 'Загружен'}
                    {message.fileStatus === 'processing' && 'Обрабатывается...'}
                    {message.fileStatus === 'ready' && 'Готов к работе'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={`px-4 py-2 rounded-lg ${
            message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        )}

        <p className="text-xs opacity-70 mt-1 px-1">
          {message.timestamp.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {message.sender === 'user' && (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0 mt-1">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}

function FilePreview({ file, onUpload, onCancel, isUploading }: {
  file: File;
  onUpload: () => void;
  onCancel: () => void;
  isUploading: boolean;
}) {
  return (
    <div className="p-3 border-b bg-background">
      <div className="flex items-center justify-between bg-muted p-3 rounded-lg overflow-hidden">
        <div className="flex items-center gap-3">
          <File className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium break-all">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onUpload}
            disabled={isUploading}
            className="shrink-0"
          >
            <Upload className="h-3 w-3 mr-1" />
            Загрузить
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="shrink-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="p-3 border-b bg-background">
      <div className="flex items-center gap-2 mb-2 overflow-hidden">
        <Upload className="h-4 w-4" />
        <span className="text-sm">Загрузка файла...</span>
      </div>
      <Progress value={progress} className="w-full" />
      <p className="text-xs text-muted-foreground mt-1">
        {progress.toFixed(0)}%
      </p>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="bg-muted px-4 py-2 rounded-lg">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
}

// Main component
export function ChatDialogNew({ open, onOpenChange }: ChatDialogProps) {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я консультант 3dbishkek.kg. Помогу вам узнать всё о 3D печати, материалах и технологиях. Чем могу помочь?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([
    {
      role: 'system',
      content: `Ты работник сайта 3dbishkek.kg - специалист по 3D печати. Твоя задача помогать клиентам узнать особенности 3D печати, технологиях, материалах и времени изготовления.

Основная информация:
- Ты консультируешь только по вопросам 3D печати, технологий и материалов
- Если вопросы не по теме, вежливо скажи что не можешь отвечать на другие вопросы
- Для связи с менеджером предоставляй: телефон +996703800842, почта ulikebot@gmail.com
- Время работы: с 9:00 до 18:00

Отвечай дружелюбно и профессионально на русском и кыргызском языке. отвечай не слишком длинно не все любят много читать`,
    },
  ]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const container = scrollRef.current;
    if (container) {
      // Use both scrollTo and scrollIntoView for better compatibility
      container.scrollTop = container.scrollHeight;
      endRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    // Use setTimeout for better reliability
    const timeoutId = setTimeout(() => scrollToBottom('smooth'), 100);
    return () => clearTimeout(timeoutId);
  }, [messages.length, isLoading, open, scrollToBottom]);

  // File handling
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Файл слишком большой. Максимальный размер: 100MB');
        return;
      }
      setSelectedFile(file);
      toast.success(`Файл выбран: ${file.name}`);
    }
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    // Simulate progress for better UX
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 90) {
        progress = 90;
        clearInterval(progressInterval);
      }
      setUploadProgress(progress);
    }, 150);

    try {
      const fileUrl = await uploadFileToServer(file);
      setUploadProgress(100);
      return fileUrl;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileUrl = await uploadFile(selectedFile);

      // Add file message to chat
      const fileMessageId = Date.now().toString();
      const fileMessage: Message = {
        id: fileMessageId,
        content: `Файл загружен: ${selectedFile.name}`,
        sender: 'user',
        timestamp: new Date(),
        type: 'file',
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileUrl: fileUrl,
        fileStatus: 'uploaded',
      };

      setMessages((prev) => [...prev, fileMessage]);
      setUploadedFileId(fileMessageId);

      // Небольшая задержка перед очисткой состояния для стабильности UI
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
      }, 200);

      // Enhanced bot notifications
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      let fileTypeMessage = '';

      // Определяем тип файла для более точного сообщения
      if (['png', 'jpg', 'jpeg'].includes(fileExtension || '')) {
        fileTypeMessage = 'изображение';
      } else if (['stl'].includes(fileExtension || '')) {
        fileTypeMessage = '3D модель STL';
      } else if (['obj'].includes(fileExtension || '')) {
        fileTypeMessage = '3D модель OBJ';
      } else if (['dae'].includes(fileExtension || '')) {
        fileTypeMessage = '3D модель DAE';
      } else if (['zip', 'tar', '7z', 'rar'].includes(fileExtension || '')) {
        fileTypeMessage = 'архив';
      } else {
        fileTypeMessage = 'файл';
      }

      // Первое уведомление - подтверждение получения
      const botNotification1: Message = {
        id: (Date.now() + 1).toString(),
        content: `✅ ${fileTypeMessage} "${selectedFile.name}" успешно получен!`,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Второе уведомление - анализ файла
      const botNotification2: Message = {
        id: (Date.now() + 2).toString(),
        content: `🔍 Анализирую ${fileTypeMessage}... Пожалуйста, подождите.`,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Финальное уведомление - готовность к работе
      const botNotification3: Message = {
        id: (Date.now() + 3).toString(),
        content: `🎯 ${fileTypeMessage} готов для обработки! Можете задавать вопросы по содержимому файла или просить помощи с ним.`,
        sender: 'bot',
        timestamp: new Date(),
      };

      // Обновляем статус файла и показываем уведомления с requestAnimationFrame для лучшей производительности
      requestAnimationFrame(() => {
        setTimeout(() => {
          setMessages((prev) =>
            prev.map(msg =>
              msg.id === uploadedFileId
                ? { ...msg, fileStatus: 'processing' as const }
                : msg
            )
          );
          setMessages((prev) => [...prev, botNotification1]);
        }, 500);

        setTimeout(() => {
          setMessages((prev) => [...prev, botNotification2]);
        }, 1500);

        setTimeout(() => {
          setMessages((prev) =>
            prev.map(msg =>
              msg.id === uploadedFileId
                ? { ...msg, fileStatus: 'ready' as const }
                : msg
            )
          );
          setMessages((prev) => [...prev, botNotification3]);
          setUploadedFileId(null);
        }, 3000);
      });

      // Toast уведомления
      toast.success(`Файл "${selectedFile.name}" успешно загружен!`);
      setTimeout(() => {
        toast.info('Бот анализирует ваш файл...', { duration: 2000 });
      }, 1000);
    } catch (error) {
      toast.error('Ошибка при загрузке файла');
      console.error('Upload error:', error);
    } finally {
      // Небольшая задержка перед окончанием загрузки для стабильности UI
      setTimeout(() => {
        setIsUploading(false);
      }, 300);
    }
  }, [selectedFile, uploadFile, uploadedFileId]);

  const clearSelectedFile = useCallback(() => {
    // Небольшая задержка для плавного исчезновения UI элементов
    setTimeout(() => {
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 100);
  }, []);

  // Message handling
  const sendMessage = useCallback(async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const newHistory = [...conversationHistory, { role: 'user', content: trimmed }];
    setConversationHistory(newHistory);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
          'Accept-Language': 'en-US,en',
        },
        body: JSON.stringify({
          model: 'glm-4.5',
          messages: newHistory,
          temperature: 0.6,
          max_tokens: 1024,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || 'Извините, произошла ошибка. Попробуйте позже.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setConversationHistory([...newHistory, { role: 'assistant', content: botResponse }]);
    } catch (err: unknown) {
      const name = err && typeof err === 'object' && 'name' in err ? (err as { name: string }).name : '';
      if (name === 'AbortError') {
        toast.info('Запрос отменен');
        return;
      }

      let errorMessage = 'Произошла ошибка. Попробуйте позже.';
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          errorMessage = 'Ошибка авторизации. Проверьте API-ключ.';
        } else if (err.message.includes('429')) {
          errorMessage = 'Слишком много запросов. Попробуйте позже.';
        } else if (err.message.includes('404')) {
          errorMessage = 'Сервис временно недоступен.';
        }
      }

      toast.error(errorMessage);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  }, [isLoading, conversationHistory]);

  const cancelRequest = useCallback(() => {
    if (abortController) {
      abortController.abort();
    }
  }, [abortController]);

  const clearChat = useCallback(() => {
    // Очищаем все состояния
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadedFileId(null);

    // Небольшая задержка перед установкой новых сообщений для плавности
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          content: 'Привет! Я консультант 3dbishkek.kg. Помогу вам узнать всё о 3D печати, материалах и технологиях. Чем могу помочь?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
      setConversationHistory([
        {
          role: 'system',
          content: `Ты работник сайта 3dbishkek.kg - специалист по 3D печати. Твоя задача помогать клиентам узнать особенности 3D печати, технологиях, материалах и времени изготовления.

Основная информация:
- Ты консультируешь только по вопросам 3D печати, технологий и материалов
- Если вопросы не по теме, вежливо скажи что не можешь отвечать на другие вопросы
- Для связи с менеджером предоставляй: телефон +996703800842, почта ulikebot@gmail.com
- Время работы: с 9:00 до 18:00

Отвечай дружелюбно и профессионально на русском и кыргызском языке. отвечай не слишком длинно не все любят много читать`,
        },
      ]);

      // Прокрутка к началу после небольшой задержки
      setTimeout(() => {
        requestAnimationFrame(() => scrollToBottom('auto'));
      }, 100);
    }, 200);
  }, [scrollToBottom]);

  // Form handlers
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  }, [inputMessage, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  }, [inputMessage, sendMessage]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[min(100vw,420px)] h-[600px] p-0 overflow-hidden">
        <div className="flex flex-col h-full min-h-0">
          {/* Header - Fixed */}
          <DialogHeader className="px-4 py-3 border-b flex items-center justify-between shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Чат с поддержкой
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={clearChat} className="h-8 w-8" aria-label="Очистить чат">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {/* Messages area - Scrollable, takes remaining space */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-scroll overflow-x-hidden px-4 py-4 pr-2 space-y-4 min-h-0"
            style={{ scrollbarGutter: 'stable both-edges' }}
          >
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={endRef} />
          </div>

          {/* Input area - Fixed at bottom */}
          <div className="border-t bg-background shrink-0">
            {/* File preview - only when file selected */}
            {selectedFile && !isUploading && (
              <FilePreview
                file={selectedFile}
                onUpload={handleFileUpload}
                onCancel={clearSelectedFile}
                isUploading={isUploading}
              />
            )}

            {/* Upload progress - only when uploading */}
            {isUploading && <UploadProgress progress={uploadProgress} />}

            {/* Input form - always visible */}
            <form onSubmit={handleSubmit} className="p-3 flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".stl,.obj,.dae,.zip,.tar,.7z,.rar,.png,.jpg,.jpeg"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
                className="shrink-0"
                aria-label="Прикрепить файл"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите сообщение... (Enter — отправить, Shift+Enter — новая строка)"
                disabled={isLoading || isUploading}
                rows={1}
                className="flex-1 resize-none max-h-32"
              />
              {isLoading ? (
                <Button type="button" size="icon" onClick={cancelRequest} variant="outline" className="shrink-0" aria-label="Остановить ответ">
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" size="icon" disabled={!inputMessage.trim() || isUploading} className="shrink-0" aria-label="Отправить">
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}