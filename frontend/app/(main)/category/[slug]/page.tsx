import { getServiceCategories } from '@/lib/services';
import CategoryPageClient from './CategoryPageClient';

// Only restrict dynamic params when doing static export
// In dynamic mode, allow runtime params for development
export const dynamicParams = process.env.STATIC_EXPORT === 'true' ? false : true;

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
