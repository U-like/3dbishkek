import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { categories } from '@/data/products';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CategoryFilter } from '@/types';
import * as Icons from 'lucide-react';

export function Categories() {
  const { selectedCategory, setSelectedCategory } = useAppStore();

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId as CategoryFilter);
    scrollToProducts();
  };

  return (
    <section id="categories" className="py-8 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Выберите категорию товара
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Откройте для себя мир 3D-печати в разных направлениях
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
            const isActive = selectedCategory === category.id;
            
            return (
              <Card
                key={category.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg group",
                  isActive && "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className={cn(
                    "w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted group-hover:bg-primary group-hover:text-primary-foreground"
                  )}>
                    {IconComponent && <IconComponent className="h-6 w-6" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Category Stats */}
        <div className="mt-12">
          <div className="bg-background rounded-lg border p-4 sm:p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Категорий</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-2xl font-bold text-primary">12+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Товаров</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Качество</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}