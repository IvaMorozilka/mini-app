'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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

// Оптимизированные варианты для мобильных (быстрее и плавнее)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 30,
      mass: 0.5,
    },
  },
};

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
      {/* Sticky Header and Search Block */}
      <motion.div
        className="sticky top-0 z-20 -mx-3 bg-background/95 backdrop-blur-sm border-b border-border/50"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Header
          title={searchQuery.trim() ? `Результаты поиска: "${searchQuery}"` : "Разделы"}
          subtitle={searchQuery.trim() ? `Найдено услуг: ${searchedServices.length}` : "Социальные меры поддержки участников СВО и их семей в Ленинградской области"}
        />
        {/* Search Bar */}
        <div className="px-3 pt-2 pb-2">
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
        </div>
      </motion.div>

      <div className="space-y-4">

        {/* Show search results or categories */}
        {searchQuery.trim() ? (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key="search-results"
          >
            {searchedServices.length > 0 ? (
              searchedServices.map((service, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ServiceCard service={service} />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-8 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p>Услуги не найдены</p>
                <p className="text-sm mt-1">
                  Попробуйте изменить параметры поиска
                </p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key="categories"
          >
            {activeCategories.length > 0 ? (
              activeCategories.map((category, index) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <CategorySection
                    category={category}
                    services={category.services}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="text-center py-8 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p>Категории не найдены</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}
