'use client';

import { motion } from 'framer-motion';
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

// Оптимизированные варианты для мобильных
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
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
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <Header 
          title={category.name} 
          subtitle={category.description}
          showBackButton={true} 
        />
      </motion.div>
      
      <div className="space-y-4">
        {/* Multi-select Filter */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <MultiSelectFilter
            options={citizenCategories}
            selected={selectedCitizenCategories}
            onSelectionChange={setSelectedCitizenCategories}
            placeholder="Категория граждан"
            className="flex-1"
          />
        </motion.div>

        {/* Category Badge */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.08, type: 'spring' as const, stiffness: 400, damping: 25 }}
        >
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {filteredServices.length} {filteredServices.length === 1 ? 'услуга' : filteredServices.length < 5 ? 'услуги' : 'услуг'}
          </span>
        </motion.div>

        {/* Services List */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={filteredServices.length}
        >
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ServiceCard service={service} />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-8 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p>Услуги не найдены</p>
              <p className="text-sm mt-1">
                Попробуйте изменить фильтр
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
