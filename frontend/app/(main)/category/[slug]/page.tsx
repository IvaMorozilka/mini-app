import { getServiceCategories } from '@/lib/services';
import CategoryPageClient from './CategoryPageClient';

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const categories = getServiceCategories();
    if (!categories || categories.length === 0) {
      console.warn('No categories found in generateStaticParams');
      return [];
    }
    return categories.map((category) => ({
      slug: category.id,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}
