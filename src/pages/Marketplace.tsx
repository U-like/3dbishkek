import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { Categories } from '@/components/sections/Categories';
import { Products } from '@/components/sections/Products';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';

export default function Marketplace() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Categories />
        <Products />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}