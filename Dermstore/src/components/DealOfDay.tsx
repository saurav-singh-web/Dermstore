// src/components/DealOfDay.tsx
import { useEffect, useState } from 'react';
import type { Product } from '../types/product';
import ProductCard from './ProductCard';

type DealProps = { product: Product; expiresAt: Date };

export default function DealOfDay({ product, expiresAt }: DealProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    function updateTimer() {
      const diff = expiresAt.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft('Expired');
      const hrs = Math.floor(diff / 1000 / 60 / 60);
      const mins = Math.floor(diff / 1000 / 60) % 60;
      const secs = Math.floor(diff / 1000) % 60;
      setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
    }
    updateTimer();
    const id = setInterval(updateTimer, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4">Deal of the Day — {timeLeft}</h3>
      <ProductCard product={product} />
    </div>
  );
}
