import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { products } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { ProductDetailModal } from '@/components/products/ProductDetailModal';
import type { Product } from '@/types';

export function Products() {
  const { selectedCategory } = useAppStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'all': return 'Все товары';
      case 'home': return 'Товары для дома';
      case 'games': return 'Игры и фигурки';
      case 'jewelry': return 'Украшения';
      case 'tools': return 'Инструменты';
      case 'robotics': return 'Робототехника';
      default: return 'Товары';
    }
  };

  return (
    <section id="products" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            {getCategoryTitle()}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {selectedCategory === 'all' 
              ? 'Лучшие модели от наших дизайнеров'
              : `Найдено ${filteredProducts.length} товаров в категории "${getCategoryTitle()}"`
            }
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
            <p className="text-muted-foreground">
              В данной категории пока нет товаров
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onCardClick={handleProductClick}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Показано {filteredProducts.length} из {products.length} товаров
            </p>
          </div>
        )}
      </div>
      
      <ProductDetailModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </section>
  );
}