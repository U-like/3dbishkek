import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { Product } from '@/types';
import { toast } from 'sonner';

interface FavoritesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FavoritesSidebar({ open, onOpenChange }: FavoritesSidebarProps) {
  const { favorites, removeFromFavorites, addToCart } = useAppStore();

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error('Товар нет в наличии');
      return;
    }
    
    addToCart(product);
    toast.success(`${product.title} добавлен в корзину`);
  };

  const handleRemoveFromFavorites = (productId: string) => {
    removeFromFavorites(productId);
    toast.success('Удалено из избранного');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Избранное
            {favorites.length > 0 && (
              <Badge variant="secondary">
                {favorites.length}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {favorites.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl">💝</div>
                <h3 className="text-lg font-semibold">Нет избранных товаров</h3>
                <p className="text-muted-foreground">
                  Добавьте товары в избранное, чтобы не потерять их
                </p>
                <Button onClick={() => onOpenChange(false)}>
                  Перейти к покупкам
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {favorites.map((product) => (
                <div key={product.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                    <span className="text-xl">📦</span>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-sm leading-tight">
                      {product.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      {product.price.toLocaleString()} сом
                    </p>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {product.inStock ? 'В корзину' : 'Нет в наличии'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromFavorites(product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}