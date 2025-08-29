import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, X, Bot, User, RotateCcw } from 'lucide-react';
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
        <div className={`px-4 py-2 rounded-lg ${
          message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
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


  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

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
            {/* Input form - always visible */}
            <form onSubmit={handleSubmit} className="p-3 flex items-end gap-2">
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
                <Button type="button" size="icon" onClick={cancelRequest} variant="outline" className="shrink-0" aria-label="Остановить ответ">
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" size="icon" disabled={!inputMessage.trim()} className="shrink-0" aria-label="Отправить">
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