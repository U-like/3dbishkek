import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { Gallery } from '@/components/sections/Gallery';
import { Technologies } from '@/components/sections/Technologies';
import { VideoSection } from '@/components/sections/VideoSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      
      <main>
        <Hero />
        <Gallery />
        <Technologies />
        <VideoSection />
      </main>
      <Footer />
    </div>
  );
}