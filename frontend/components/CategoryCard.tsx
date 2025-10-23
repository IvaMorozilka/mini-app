'use client'; // <-- Обязательно

import { useRouter } from 'next/navigation';
import { useAnimation } from '@/context/AnimationContext'; // <-- Наш хук

type Category = {
  id: string;
  name: string;
};

export default function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();
  const { setDirection } = useAnimation();

  const handleClick = () => {
    setDirection('forward'); // 1. Устанавливаем направление
    router.push(`/category/${category.id}`); // 2. Делаем переход
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        padding: '2rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '1rem',
        cursor: 'pointer'
      }}
    >
      <h3>{category.name}</h3>
    </div>
  );
}