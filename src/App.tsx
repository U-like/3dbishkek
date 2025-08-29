import { useState, Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { Gallery } from '@/components/sections/Gallery';
import { Technologies } from '@/components/sections/Technologies';
import { VideoSection } from '@/components/sections/VideoSection';
import { Categories } from '@/components/sections/Categories';
import { Products } from '@/components/sections/Products';
import { Footer } from '@/components/layout/Footer';
import { OrderPage } from '@/pages/Order';
import { ChatButton, ChatDialogNew } from '@/components/chat';
import CookieConsentBanner from '@/components/cookies/CookieConsent';
 
// Lazy load heavy components
const ThreeBackground = lazy(() => import('@/components/3d/ThreeBackground').then(module => ({ default: module.ThreeBackground })));

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'order'>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="light" storageKey="3dbishkek-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <CookieConsentBanner />
          <div className="min-h-screen">
          {currentView === 'home' ? (
            // Home Page
            <>
              <Header currentView={currentView} onViewChange={setCurrentView} />
              <main>
                <Hero onViewChange={setCurrentView} />
                <Gallery />
                <Technologies />
                <VideoSection />
              </main>
              <Footer />
            </>
          ) : currentView === 'shop' ? (
            // Shop Page
            <>
              {/* Header Section with 3D Background */}
              <div className="relative min-h-[400px] overflow-hidden">
                <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-background to-muted animate-pulse" />}>
                  <ThreeBackground />
                </Suspense>
                <Header currentView={currentView} onViewChange={setCurrentView} />
                <div className="pt-8 relative z-10">
                  <Categories />
                </div>
              </div>
              
              {/* Products Section with Regular Background */}
              <div className="min-h-screen bg-white dark:bg-gray-900">
                <main className="relative z-10">
                  <Products />
                </main>
                <Footer />
              </div>
            </>
          ) : (
            // Order Page
            <OrderPage onViewChange={setCurrentView} />
          )}

          {/* Global Chat Components */}
          <ChatButton onClick={() => setIsChatOpen(true)} />
          <ChatDialogNew open={isChatOpen} onOpenChange={setIsChatOpen} />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
};

export default App;