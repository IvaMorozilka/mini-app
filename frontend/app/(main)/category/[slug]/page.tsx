import { getServiceCategories } from '@/lib/services';
import CategoryPageClient from './CategoryPageClient';

// dynamicParams defaults to true (allows dynamic params in development)
// For static export, it will be set to false by CI/CD build script

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
