import { useEffect, useCallback } from 'react';

interface UseBrowserHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  historyKey?: string;
}

export function useBrowserHistory({ isOpen, onClose, historyKey = 'modal' }: UseBrowserHistoryProps) {
  const handlePopState = useCallback((event: PopStateEvent) => {
    if (event.state?.modal === historyKey && isOpen) {
      onClose();
    }
  }, [isOpen, onClose, historyKey]);

  useEffect(() => {
    if (isOpen) {
      // Добавляем состояние в историю браузера
      window.history.pushState({ modal: historyKey }, '', window.location.href);
      
      // Слушаем событие popstate (кнопка назад)
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOpen, handlePopState, historyKey]);

  useEffect(() => {
    // Очищаем состояние при закрытии
    if (!isOpen) {
      // Проверяем, если текущее состояние содержит наш модальный ключ
      if (window.history.state?.modal === historyKey) {
        window.history.back();
      }
    }
  }, [isOpen, historyKey]);
}