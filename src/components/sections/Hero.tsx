import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ThreeBackground } from '@/components/3d/ThreeBackground';

interface HeroProps {
  onViewChange?: (view: 'home' | 'shop' | 'order') => void;
}

export function Hero({ onViewChange }: HeroProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onViewChange?.('shop');
  };

  return (
    <section id="hero" className="relative pt-20 pb-16 px-4 overflow-hidden">
      <ThreeBackground />
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Крупнейший маркетплейс 3D-печати
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Воплощайте{' '}
                <span className="text-primary">идеи</span>{' '}
                в реальность
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Уникальные модели и готовые изделия от лучших мастеров Кыргызстана. 
                Качественная 3D-печать для всех ваших проектов.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleShopClick}
                className="group"
              >
                Перейти в магазин
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => scrollToSection('gallery')}
              >
                Посмотреть работы
              </Button>
              <Button 
                size="lg" 
                className="gap-2"
                onClick={() => onViewChange?.('order')}
              >
                Заказать печать
              </Button>
            </div>

            {/* Stats */}
            <div className="pt-8">
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold">500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Товаров в каталоге</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold">1000+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Довольных клиентов</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold">24/7</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Поддержка</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Pills */}

        </div>
      </div>
    </section>
  );
}