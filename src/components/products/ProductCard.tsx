import { useState, memo, useCallback } from 'react';
import { Heart, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onCardClick?: (product: Product) => void;
}

export const ProductCard = memo(function ProductCard({ product, onCardClick }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    addToCart,
    addToFavorites,
    removeFromFavorites,
    favorites
  } = useAppStore();

  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleAddToCart = useCallback(async () => {
    if (!product.inStock) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    addToCart(product);
    toast.success(`${product.title} добавлен в корзину`);
    setIsLoading(false);
  }, [product, addToCart]);

  const handleToggleFavorite = useCallback(() => {
    if (isFavorite) {
      removeFromFavorites(product.id);
      toast.success('Удалено из избранного');
    } else {
      addToFavorites(product);
      toast.success('Добавлено в избранное');
    }
  }, [isFavorite, product.id, addToFavorites, removeFromFavorites]);

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'new': return 'default';
      case 'hit': return 'destructive';
      case 'sale': return 'secondary';
      default: return 'default';
    }
  };

  const getBadgeText = (badge: string) => {
    switch (badge) {
      case 'new': return 'Новинка';
      case 'hit': return 'Хит';
      case 'sale': return 'Скидка';
      default: return badge;
    }
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      onClick={() => onCardClick?.(product)}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square bg-muted/50 flex items-center justify-center overflow-hidden">
          {/* Product Image Placeholder */}
          <div className="w-24 h-24 bg-primary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <Package className="h-12 w-12 text-primary" />
          </div>
          
          {/* Badge */}
          {product.badge && (
            <Badge 
              variant={getBadgeVariant(product.badge)}
              className="absolute top-3 left-3"
            >
              {getBadgeText(product.badge)}
            </Badge>
          )}
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity",
              isFavorite && "opacity-100 text-red-500 hover:text-red-600"
            )}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
          
          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary">Нет в наличии</Badge>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">
              {product.price.toLocaleString()} сом
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={!product.inStock || isLoading}
              size="sm"
              className="shrink-0"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  В корзину
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});