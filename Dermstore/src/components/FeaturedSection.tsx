// src/components/FeaturedSection.tsx
import type { Product } from '../types/product';
import ProductCard from './ProductCard';

type FeaturedSectionProps = {
  title: string;
  products: Product[];
};

const FeaturedSection = ({ title, products }: FeaturedSectionProps) => (
  <div className="mb-8">
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {products.map((p) => (
        <div key={p._id} className="flex-shrink-0 w-64">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  </div>
);

export default FeaturedSection;
