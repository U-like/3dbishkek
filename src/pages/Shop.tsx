import { Header } from '@/components/layout/Header';
import { Categories } from '@/components/sections/Categories';
import { Products } from '@/components/sections/Products';
import { Footer } from '@/components/layout/Footer';
import { ThreeBackground } from '@/components/3d/ThreeBackground';

export default function Shop() {
  return (
    <div className="min-h-screen">
      {/* Header Section with 3D Background */}
      <div className="relative min-h-[400px] overflow-hidden">
        <ThreeBackground />
        <div className="pt-0 relative z-10">
          <Categories />
        </div>
      </div>
      
      {/* Products Section with Regular Background */}
      <div className="bg-gray-50 min-h-screen">
        <main className="relative z-10">
          <Products />
        </main>
        <Footer />
      </div>
    </div>
  );
}