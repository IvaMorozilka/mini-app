import { getServiceCategories } from '@/lib/services';
import CategoryPageClient from './CategoryPageClient';

export async function generateStaticParams() {
  const categories = getServiceCategories();
  return categories.map((category) => ({
    slug: category.id,
  }));
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}
