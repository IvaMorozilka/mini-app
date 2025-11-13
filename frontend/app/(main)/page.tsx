'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import CategorySection from '@/components/CategorySection';
import ServiceCard from '@/components/ServiceCard';
import { Input } from '@/components/ui/input';
import {
  getAllServices,
  getServiceCategories,
  searchServices,
  getServicesGroupedByCategory,
  type Service,
} from '@/lib/services';
import { Search } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Get all data
  const allServices = getAllServices();
  const serviceCategories = getServiceCategories();

  // Search services
  const searchedServices = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return searchServices(allServices, searchQuery);
  }, [allServices, searchQuery]);

  // Group all services by category (when not searching)
  const groupedServices = useMemo(() => {
    if (searchQuery.trim()) {
      return new Map<string, Service[]>();
    }
    return getServicesGroupedByCategory(allServices);
  }, [allServices, searchQuery]);

  // Get categories that have services
  const activeCategories = useMemo(() => {
    if (searchQuery.trim()) {
      return [];
    }
    return serviceCategories
      .filter((cat) => groupedServices.has(cat.name))
      .map((cat) => ({
        ...cat,
        services: groupedServices.get(cat.name) || [],
      }));
  }, [serviceCategories, groupedServices, searchQuery]);

  return (
    <>
      <Header
        title="Разделы"
        subtitle="Социальные меры поддержки участников СВО и их семей в Ленинградской области"
      />

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Show search results or categories */}
        {searchQuery.trim() ? (
          <div className="space-y-3">
            {searchedServices.length > 0 ? (
              searchedServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Услуги не найдены</p>
                <p className="text-sm mt-1">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {activeCategories.length > 0 ? (
              activeCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  services={category.services}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Категории не найдены</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
