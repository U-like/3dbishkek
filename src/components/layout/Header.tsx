import { useState } from 'react';
import { ShoppingCart, Heart, HelpCircle, Menu, Printer, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppStore } from '@/lib/store';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { FavoritesSidebar } from '@/components/favorites/FavoritesSidebar';

import { ContactDialog } from '@/components/dialogs/ContactDialog';
import { AboutDialog } from '@/components/dialogs/AboutDialog';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface HeaderProps {
  currentView: 'home' | 'shop' | 'order';
  onViewChange: (view: 'home' | 'shop' | 'order') => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
  
  const { 
    cart, 
    favorites, 
    isCartOpen, 
    setCartOpen, 
    isFavoritesOpen, 
    setFavoritesOpen 
  } = useAppStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleViewChange = (view: 'home' | 'shop') => {
    onViewChange(view);
    scrollToTop();
  };



  const homeLinks: { label: string; href: string }[] = [];

  const shopLinks = [
    { label: 'Товары', href: '#products' },
  ];

  const navLinks = currentView === 'shop' ? shopLinks : homeLinks;

  return (
    <>
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
        <div className="container mx-auto px-4 py-3">
          <nav className="grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => handleViewChange('home')}
            >
              <Printer className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">3DBishkek</span>
            </div>

            {/* Desktop Navigation - Centered and stable */}
            <div className="hidden md:flex items-center justify-center gap-8">
              <button
                onClick={() => {
                  if (currentView === 'shop') {
                    scrollToSection('products');
                  } else {
                    handleViewChange('shop');
                  }
                }}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Магазин
              </button>
              <button
                onClick={() => setIsContactDialogOpen(true)}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Связь
              </button>
              <button
                onClick={() => setIsAboutDialogOpen(true)}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                О нас
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
              {/* Theme Toggle - Always visible on desktop, stays on the right */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              
              {/* Favorites - Always visible */}
              {currentView === 'shop' && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setFavoritesOpen(true)}
              >
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
              )}
              {/* Cart - Only show in shop */}
              {currentView === 'shop' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-4 mt-8">
                    <button
                      onClick={() => {
                        handleViewChange('home');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left p-2 rounded-md transition-colors ${
                        currentView === 'home' ? 'bg-accent text-primary' : 'hover:bg-accent'
                      }`}
                    >
                      Главная
                    </button>
                    <button
                      onClick={() => {
                        handleViewChange('shop');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left p-2 rounded-md transition-colors ${
                        currentView === 'shop' ? 'bg-accent text-primary' : 'hover:bg-accent'
                      }`}
                    >
                      Магазин
                    </button>
                    {navLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => scrollToSection(link.href.slice(1))}
                        className="text-left p-2 hover:bg-accent rounded-md transition-colors"
                      >
                        {link.label}
                      </button>
                    ))}
                    <Button
                      variant="ghost"
                      onClick={() => setIsContactDialogOpen(true)}
                      className="justify-start gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Контакты
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAboutDialogOpen(true)}
                      className="justify-start gap-2"
                    >
                      <HelpCircle className="h-4 w-4" />
                      О нас
                    </Button>
                    
                    {/* Theme Toggle in Mobile Menu */}
                    <div className="flex items-center justify-between p-2 border-t pt-4">
                      <span className="text-sm font-medium">Тема</span>
                      <ThemeToggle />
                    </div>

                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      {/* Sidebars - Always available */}
      <CartSidebar open={isCartOpen} onOpenChange={setCartOpen} />
      <FavoritesSidebar open={isFavoritesOpen} onOpenChange={setFavoritesOpen} />
      

      
      {/* Contact Dialog */}
      <ContactDialog 
        open={isContactDialogOpen} 
        onOpenChange={setIsContactDialogOpen}
      />
      
      {/* About Dialog */}
      <AboutDialog 
        open={isAboutDialogOpen} 
        onOpenChange={setIsAboutDialogOpen}
      />
    </>
  );
}