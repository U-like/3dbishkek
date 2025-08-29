import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Bot, User, RotateCcw, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Constants
const API_KEY = import.meta.env.VITE_ZAI_API_KEY || 'ee85251eddbd4d74bf97ed21916a37df.6uXGJqojuyLrx8rR';
const CHAT_HEIGHT = '600px';
const INPUT_AREA_HEIGHT = 'auto';
const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const UPLOAD_ENDPOINT = `${BASE_PATH}/api/upload.php`;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
// Helpers
function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return '';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  const fraction = value < 10 && i > 0 ? 1 : 0;
  return `${value.toFixed(fraction)} ${units[i]}`;
}
const ALLOWED_EXTS = ['stl','obj','dae','fbx','zip','tar','rar','7z','7zip','png','jpg','jpeg'];

// Sub-components
function renderContent(text: string) {
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  const parts = text.split(urlPattern);
  return parts.map((part, idx) => {
    if (/^https?:\/\//i.test(part)) {
      return (
        <a key={idx} href={part} target="_blank" rel="noopener noreferrer" className="underline text-primary break-all">
          {part}
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function MessageItem({ message }: { message: Message }) {
  return (
    <div className={`flex w-full items-start gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'bot' && (
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-1">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className="flex flex-col max-w-[80%]">
        <div
          className={`px-4 py-2 rounded-lg ${
            message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{renderContent(message.content)}</p>
        </div>

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
      content:
        'Привет! Я консультант 3dbishkek.kg. Помогу вам узнать всё о 3D печати, материалах и технологиях. Чем могу помочь?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      endRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const timeoutId = setTimeout(() => scrollToBottom('smooth'), 100);
    return () => clearTimeout(timeoutId);
  }, [messages.length, isLoading, open, scrollToBottom]);

  // Message handling
  const sendMessage = useCallback(async () => {
    if (isLoading) return;
    const trimmed = inputMessage.trim();
    if (!trimmed && !selectedFile) return;

    const controller = new AbortController();
    setAbortController(controller);
    setIsLoading(true);

    try {
      // 1) Upload file first if present
      let fileInfo: { url: string; name: string } | null = null;
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);

          const uploadResponse = await fetch(UPLOAD_ENDPOINT, {
            method: 'POST',
            body: formData,
            signal: controller.signal,
          });

          if (!uploadResponse.ok) {
            throw new Error(`UPLOAD_HTTP_${uploadResponse.status}`);
          }
          const uploadData = await uploadResponse.json();
          if (!uploadData?.success || !uploadData?.url) {
            throw new Error(uploadData?.error || 'UPLOAD_FAILED');
          }
          fileInfo = { url: uploadData.url, name: uploadData.name || selectedFile.name };
        } catch (uploadErr) {
          // If upload failed but user typed text - proceed with text only
          if (trimmed) {
            toast.info('Файл не удалось загрузить. Сообщение отправлено без файла.');
          } else {
            // Only file (no text) - abort with error
            throw uploadErr;
          }
        }
      }

      // 2) Build user content with optional file link
      let contentToSend = trimmed;
      if (fileInfo) {
        const fileLine = `Прикрепленный файл: ${fileInfo.url}`;
        contentToSend = trimmed ? `${trimmed}\n${fileLine}` : fileLine;
      }

      // 3) Echo user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: contentToSend,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputMessage('');
      setSelectedFile(null);

      // 4) Update history
      const newHistory = [...conversationHistory, { role: 'user', content: contentToSend }];
      setConversationHistory(newHistory);

      // 5) Ask bot
      const response = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
          'Accept-Language': 'en-US,en',
        },
        body: JSON.stringify({
          model: 'GLM-4.5-Flash',
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
      } else {
        let errorMessage = 'Произошла ошибка. Попробуйте позже.';
        if (err instanceof Error) {
          if (err.message.includes('401')) {
            errorMessage = 'Ошибка авторизации. Проверьте API-ключ.';
          } else if (err.message.includes('429')) {
            errorMessage = 'Слишком много запросов. Попробуйте позже.';
          } else if (err.message.includes('404')) {
            errorMessage = 'Сервис временно недоступен.';
          } else if (err.message.includes('UPLOAD')) {
            errorMessage = 'Не удалось загрузить файл. Попробуйте другой файл или позже.';
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
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  }, [isLoading, inputMessage, selectedFile, conversationHistory]);

  const cancelRequest = useCallback(() => {
    if (abortController) {
      abortController.abort();
    }
  }, [abortController]);

  const clearChat = useCallback(() => {
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          content:
            'Привет! Я консультант 3dbishkek.kg. Помогу вам узнать всё о 3D печати, материалах и технологиях. Чем могу помочь?',
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

      setTimeout(() => {
        requestAnimationFrame(() => scrollToBottom('auto'));
      }, 100);
    }, 200);
  }, [scrollToBottom]);

  // File + form handlers
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_EXTS.includes(ext)) {
        toast.error('Неподдерживаемый формат файла. Разрешено: stl, obj, dae, fbx, zip, tar, rar, 7zip, png, jpg, jpeg');
        e.currentTarget.value = '';
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Файл слишком большой. Максимум 25 МБ');
        e.currentTarget.value = '';
        return;
      }
      setSelectedFile(file);
    }
    // Allow re-selecting the same file
    e.currentTarget.value = '';
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage();
    },
    [sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (inputMessage.trim() || selectedFile) {
          sendMessage();
        }
      }
    },
    [inputMessage, selectedFile, sendMessage]
  );

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
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="h-8 w-8"
              aria-label="Очистить чат"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </DialogHeader>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 pr-2 space-y-4 min-h-0 hide-scrollbar"
          >
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={endRef} />
          </div>

          {/* Input area - Fixed at bottom */}
          <div className="border-t bg-background shrink-0">
            {selectedFile && (
              <div className="px-3 pt-2">
                <div className="inline-flex items-center gap-2 bg-muted rounded px-2 py-1 text-xs">
                  <span className="max-w-[220px] truncate">{selectedFile.name}</span>
                  <span className="text-muted-foreground">• {formatBytes(selectedFile.size)}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => setSelectedFile(null)}
                    aria-label="Удалить файл"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            <div className="px-3 pt-1 pb-0.5">
              <p className="text-[11px] text-muted-foreground">
                Форматы: stl, obj, dae, fbx, zip, tar, rar, 7zip, png, jpg, jpeg. До 25 МБ
              </p>
            </div>
            {/* Input form - always visible */}
            <form onSubmit={handleSubmit} className="p-3 flex items-end gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".stl,.obj,.dae,.fbx,.zip,.tar,.rar,.7z,.7zip,.png,.jpg,.jpeg"
              />

              {/* Attach button */}
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0"
                disabled={isLoading}
                aria-label="Прикрепить файл"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите сообщение... (Enter — отправить, Shift+Enter — новая строка)"
                disabled={isLoading}
                rows={1}
                className="flex-1 resize-none max-h-32"
              />
              {isLoading ? (
                <Button
                  type="button"
                  size="icon"
                  onClick={cancelRequest}
                  variant="outline"
                  className="shrink-0"
                  aria-label="Остановить ответ"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputMessage.trim() && !selectedFile}
                  className="shrink-0"
                  aria-label="Отправить"
                >
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