// src/components/HeroBanner.tsx
import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <div className="w-full h-60 sm:h-96 bg-cover bg-center rounded-md mb-8"
         style={{ backgroundImage: "url('https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/newscms/2021_07/3451045/210218-product-of-the-year-2x1-cs.jpg')" }}>
      <div className="h-full bg-black/30 flex flex-col justify-center items-center text-white p-4">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Glowing Skin Starts Here</h2>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
