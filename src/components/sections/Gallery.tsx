import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const galleryItems = [
  {
    id: 1,
    title: 'Архитектурные модели',
    description: 'Точные макеты зданий и сооружений',
    image: '🏗️',
    category: 'Архитектура'
  },
  {
    id: 2,
    title: 'Медицинские протезы',
    description: 'Индивидуальные протезы и имплантаты',
    image: '🦴',
    category: 'Медицина'
  },
  {
    id: 3,
    title: 'Автомобильные детали',
    description: 'Запчасти и тюнинг для автомобилей',
    image: '🚗',
    category: 'Автомобили'
  },
  {
    id: 4,
    title: 'Ювелирные изделия',
    description: 'Уникальные украшения и аксессуары',
    image: '💎',
    category: 'Ювелирка'
  },
  {
    id: 5,
    title: 'Игрушки и фигурки',
    description: 'Коллекционные модели и детские игрушки',
    image: '🎮',
    category: 'Развлечения'
  },
  {
    id: 6,
    title: 'Инженерные детали',
    description: 'Функциональные компоненты и механизмы',
    image: '⚙️',
    category: 'Инженерия'
  }
];

export function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  return (
    <section id="gallery" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="text-sm font-medium">
            Наши работы
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Галерея проектов
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Примеры наших работ в различных областях 3D-печати
          </p>
        </div>

        {/* Main Gallery Slider */}
        <div className="relative max-w-4xl mx-auto mb-8">
          <div className="aspect-video bg-muted rounded-xl flex items-center justify-center relative overflow-hidden group">
            <div className="text-8xl mb-4">
              {galleryItems[currentIndex].image}
            </div>
            
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Zoom Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-9xl">
                    {galleryItems[currentIndex].image}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Current Item Info */}
          <div className="text-center mt-6 space-y-2">
            <Badge variant="secondary">
              {galleryItems[currentIndex].category}
            </Badge>
            <h3 className="text-2xl font-semibold">
              {galleryItems[currentIndex].title}
            </h3>
            <p className="text-muted-foreground">
              {galleryItems[currentIndex].description}
            </p>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex justify-center gap-2 flex-wrap">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl transition-all ${
                index === currentIndex
                  ? 'border-primary bg-primary/10'
                  : 'border-muted-foreground/20 hover:border-primary/50'
              }`}
            >
              {item.image}
            </button>
          ))}
        </div>

        {/* Gallery Stats */}
        <div className="mt-12">
          <div className="bg-muted rounded-lg p-4 sm:p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">500+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Проектов</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-2xl sm:text-3xl font-bold text-primary">50+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Довольных клиентов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">15</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Материалов</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}