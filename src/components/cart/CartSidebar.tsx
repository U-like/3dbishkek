import { memo, useCallback } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

interface CartSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartSidebar = memo(function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useAppStore();

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;

    toast.success('Переход к оформлению заказа...');
    // Here you would implement actual checkout logic
    onOpenChange(false);
  }, [cart.length, onOpenChange]);

  const handleClearCart = useCallback(() => {
    clearCart();
    toast.success('Корзина очищена');
  }, [clearCart]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Корзина
            {cart.length > 0 && (
              <Badge variant="secondary">
                {cart.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl">🛒</div>
                <h3 className="text-lg font-semibold">Корзина пуста</h3>
                <p className="text-muted-foreground">
                  Добавьте товары для оформления заказа
                </p>
                <Button onClick={() => onOpenChange(false)}>
                  Продолжить покупки
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-auto py-4 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                      <span className="text-xl">📦</span>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toLocaleString()} сом
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Cart Summary */}
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Итого:</span>
                  <span className="text-2xl font-bold text-primary">
                    {cartTotal.toLocaleString()} сом
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Оформить заказ
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onOpenChange(false)}
                  >
                    Продолжить покупки
                  </Button>
                  {cart.length > 0 && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-destructive hover:text-destructive"
                      onClick={handleClearCart}
                    >
                      Очистить корзину
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
});