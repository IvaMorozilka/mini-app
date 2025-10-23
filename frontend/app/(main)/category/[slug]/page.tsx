'use client';

import Header from '@/components/Header';
import { useParams } from 'next/navigation';
import { getCategoryById } from '@/lib/data'; // <-- Импортируем нашу "поисковую" функцию
import { useEffect, useState } from 'react';
import type { Category } from '@/lib/data'; // <-- Импортируем тип

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | undefined>(undefined);

  // Используем useEffect, чтобы найти данные, когда компонент загрузится
  useEffect(() => {
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    if (slug) {
      const foundCategory = getCategoryById(slug);
      setCategory(foundCategory);
    }
  }, [params.slug]); // Эффект будет перезапускаться, если slug изменится

  // Пока данные ищутся или не найдены, можно показать заглушку
  if (!category) {
    return (
      <>
        <Header title="Загрузка..." showBackButton={true} />
        <div className="p-4">
          <p>Категория не найдена или загружается...</p>
        </div>
      </>
    );
  }

  // Когда данные найдены, рендерим страницу с правильным именем
  return (
    <>
      <Header title={category.name} showBackButton={true} />
      <div>
        <p className="text-muted-foreground">{category.description}</p>
        {/* Здесь будет остальной контент для категории */}
      </div>
    </>
  );
}