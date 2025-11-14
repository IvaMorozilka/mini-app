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
  searchServices,
  type ServiceCategory,
  type Service 
} from '@/lib/services';
import ServiceCard from '@/components/ServiceCard';
import MultiSelectFilter from '@/components/MultiSelectFilter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<'all' | 'regional' | 'federal'>('all');
  const [loading, setLoading] = useState(true);

  const citizenCategories = getCitizenCategories().filter(cat => cat.id !== 'all');

  // Filter and sort services based on citizen category, service type, and search query
  const filteredServices = useMemo(() => {
    let services = allServices;
    
    // Filter by service type
    if (serviceTypeFilter !== 'all') {
      services = services.filter(service => {
        if (serviceTypeFilter === 'regional') {
          return service.тип_услуги === 'Региональная';
        } else if (serviceTypeFilter === 'federal') {
          return service.тип_услуги === 'Федеральная';
        }
        return true;
      });
    }
    
    // Filter by citizen category
    if (selectedCitizenCategories.length > 0) {
      services = filterServices(services, undefined, selectedCitizenCategories);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      services = searchServices(services, searchQuery);
    }
    
    // Sort: regional before federal
    return sortServices(services);
  }, [allServices, selectedCitizenCategories, searchQuery, serviceTypeFilter]);

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
      {/* Sticky Header and Search Block */}
      <motion.div
        className="sticky top-[-12px] z-20 -mx-3 -mt-3 pt-2 bg-background/95 backdrop-blur-sm border-b border-border/50"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <Header 
          title={category.name} 
          showBackButton={true}
          rightSide={
            <span className="text-[10px] sm:text-xs bg-primary/10 text-primary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap">
              {filteredServices.length} {filteredServices.length === 1 ? 'услуга' : filteredServices.length < 5 ? 'услуги' : 'услуг'}
            </span>
          }
        />
        {/* Search Input and Filter */}
        <div className="px-3 pt-1 pb-1.5 space-y-1.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>

          {/* Multi-select Filter */}
          <div className="flex gap-1.5">
            <MultiSelectFilter
              options={citizenCategories}
              selected={selectedCitizenCategories}
              onSelectionChange={setSelectedCitizenCategories}
              placeholder="Категория граждан"
              className="flex-1"
            />
          </div>

          {/* Service Type Filter Buttons */}
          <div className="flex gap-1.5 flex-wrap">
            <Button
              variant={serviceTypeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setServiceTypeFilter('all')}
              className="text-[11px] h-7 px-2"
            >
              Все
            </Button>
            <Button
              variant={serviceTypeFilter === 'regional' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setServiceTypeFilter('regional')}
              className="text-[11px] h-7 px-2"
            >
              Регион.
            </Button>
            <Button
              variant={serviceTypeFilter === 'federal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setServiceTypeFilter('federal')}
              className="text-[11px] h-7 px-2"
            >
              Федер.
            </Button>
          </div>
        </div>
      </motion.div>
      
      <div className="space-y-4 pt-2">

        {/* Services List */}
        <motion.div
          className="space-y-2"
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
