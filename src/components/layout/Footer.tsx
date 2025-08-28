import { Printer, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Printer className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">3DBishkek</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Крупнейший маркетплейс 3D-печати в Бишкеке. 
              Воплощаем ваши идеи в реальность с помощью современных технологий.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <span className="text-sm">📱</span>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <span className="text-sm">📧</span>
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <span className="text-sm">📞</span>
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Контакты</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+996 (703) 800-842</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">info@3dbishkek.kg</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  г. Бишкек, ****<br />
                  ****
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 3DBishkek. Все права защищены.
          </div>
          <div className="flex gap-6 text-sm">
            <button className="text-muted-foreground hover:text-primary transition-colors">
              Политика конфиденциальности
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              Условия использования
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}