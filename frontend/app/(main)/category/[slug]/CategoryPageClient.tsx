'use client';

import Header from '@/components/Header';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { 
  getCategoryBySlug, 
  getServicesByCategorySlug,
  getServiceCategories,
  getCitizenCategories,
  filterServices,
  sortServices,
  type ServiceCategory,
  type Service 
} from '@/lib/services';
import ServiceCard from '@/components/ServiceCard';
import MultiSelectFilter from '@/components/MultiSelectFilter';

export default function CategoryPageClient() {
  const params = useParams();
  const [category, setCategory] = useState<ServiceCategory | undefined>(undefined);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedCitizenCategories, setSelectedCitizenCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const citizenCategories = getCitizenCategories().filter(cat => cat.id !== 'all');

  // Filter and sort services based on citizen category
  const filteredServices = useMemo(() => {
    let services = allServices;
    if (selectedCitizenCategories.length > 0) {
      services = filterServices(allServices, undefined, selectedCitizenCategories);
    }
    // Sort: regional before federal
    return sortServices(services);
  }, [allServices, selectedCitizenCategories]);

  useEffect(() => {
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    if (slug) {
      setLoading(true);
      // Decode URL-encoded slug
      let decodedSlug = slug;
      try {
        decodedSlug = decodeURIComponent(slug);
      } catch (e) {
        // If decoding fails, use the original slug
        decodedSlug = slug;
      }
      
      // Ensure categories are loaded
      const allCategories = getServiceCategories();
      if (allCategories.length === 0) {
        console.error('No categories loaded');
        setCategory(undefined);
        setAllServices([]);
        setLoading(false);
        return;
      }
      
      const foundCategory = getCategoryBySlug(decodedSlug);
      setCategory(foundCategory);
      
      if (foundCategory) {
        const categoryServices = getServicesByCategorySlug(decodedSlug);
        setAllServices(categoryServices);
      } else {
        console.error('Category not found for slug:', decodedSlug);
        console.log('Available categories:', allCategories.map(c => c.id));
      }
      setLoading(false);
    }
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <Header title="Загрузка..." showBackButton={true} />
        <div className="p-4">
          <p>Загрузка категории...</p>
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Header title="Категория не найдена" showBackButton={true} />
        <div className="p-4">
          <p>Категория не найдена. Пожалуйста, вернитесь на главную страницу.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header 
        title={category.name} 
        subtitle={category.description}
        showBackButton={true} 
      />
      
      <div className="space-y-4">
        {/* Multi-select Filter */}
        <div className="flex gap-2">
          <MultiSelectFilter
            options={citizenCategories}
            selected={selectedCitizenCategories}
            onSelectionChange={setSelectedCitizenCategories}
            placeholder="Категория граждан"
            className="flex-1"
          />
        </div>

        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {filteredServices.length} {filteredServices.length === 1 ? 'услуга' : filteredServices.length < 5 ? 'услуги' : 'услуг'}
          </span>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Услуги не найдены</p>
              <p className="text-sm mt-1">
                Попробуйте изменить фильтр
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

