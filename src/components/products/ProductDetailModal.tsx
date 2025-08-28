import { useState } from 'react';
import { X, ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import type { Product } from '@/types';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, addToFavorites, removeFromFavorites, favorites } = useAppStore();

  if (!product) return null;

  const isFavorite = favorites.some(item => item.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Mock additional images for demonstration
  const allImages = [
    product.image || '/placeholder-product.jpg', 
    product.image || '/placeholder-product.jpg', 
    product.image || '/placeholder-product.jpg'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="p-6 bg-gray-50">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-white">
                <img
                  src={product.image || '/placeholder-product.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Thumbnails */}
              <div className="flex gap-2 justify-center">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Badge variant="secondary">{product.category}</Badge>
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.rating}) • 47 отзывов
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 z-10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{product.price} сом</div>
              <div className="text-sm text-muted-foreground">
                Доставка от 100 сом • В наличии
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold">Описание</h3>
              <p className="text-muted-foreground leading-relaxed">
                Высококачественное изделие, напечатанное на современном 3D-принтере с использованием 
                прочного PLA+ пластика. Идеально подходит для декора, подарков или практического использования. 
                Точная детализация и гладкая поверхность гарантированы.
              </p>
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <h3 className="font-semibold">Характеристики</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Материал:</div>
                <div>PLA+ пластик</div>
                <div className="text-muted-foreground">Размер:</div>
                <div>10 x 8 x 5 см</div>
                <div className="text-muted-foreground">Вес:</div>
                <div>150 г</div>
                <div className="text-muted-foreground">Цвет:</div>
                <div>Белый/Серый</div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-4 border-t">
              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Количество:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Добавить в корзину
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleFavoriteToggle}
                  className={isFavorite ? 'text-red-500 border-red-200' : ''}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium">Итого:</span>
                <span className="text-xl font-bold text-primary">
                  {product.price * quantity} сом
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}