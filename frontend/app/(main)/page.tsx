import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';
import { getAllCategories } from '@/lib/data'; // <-- Импортируем нашу функцию

export default function HomePage() {
  const categories = getAllCategories(); // <-- Получаем данные из центрального источника

  return (
    <>
      <Header title="Категории услуг" />
      <div> {/* Убрали inline-стили, т.к. padding теперь на motion.main */}
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </>
  );
}