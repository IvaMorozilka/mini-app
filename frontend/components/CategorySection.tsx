'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAnimation } from '@/context/AnimationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service, ServiceCategory, sortServices } from '@/lib/services';
import ServiceCard from './ServiceCard';

type CategorySectionProps = {
  category: ServiceCategory;
  services: Service[];
  initialShowCount?: number;
};

// Оптимизированные варианты для мобильных
const servicesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.02,
    },
  },
};

const serviceItemVariants = {
  hidden: { opacity: 0, x: -5 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 30,
      mass: 0.5,
    },
  },
};

export default function CategorySection({ 
  category, 
  services, 
  initialShowCount = 2 
}: CategorySectionProps) {
  const router = useRouter();
  const { setDirection } = useAnimation();

  // Sort services: regional before federal
  const sortedServices = sortServices(services);
  const displayedServices = sortedServices.slice(0, initialShowCount);
  const hasMore = sortedServices.length > initialShowCount;

  const handleCategoryClick = () => {
    setDirection('forward');
    router.push(`/category/${category.id}`);
  };

  const handleShowMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection('forward');
    router.push(`/category/${category.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.5,
      }}
    >
      <Card className="mb-4 bg-card border-2 shadow-md overflow-hidden gap-0 py-0">
        <CardHeader 
          className="cursor-pointer active:bg-muted/50 transition-colors border-b-2 bg-muted/30 py-3 px-4"
          onClick={handleCategoryClick}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg font-semibold">
                  {category.name}
                </CardTitle>
                <motion.span
                  className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {category.serviceCount} {category.serviceCount === 1 ? 'услуга' : category.serviceCount < 5 ? 'услуги' : 'услуг'}
                </motion.span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-3 pb-3 px-4 bg-muted/20">
          <motion.div
            className="space-y-2"
            variants={servicesContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayedServices.map((service, index) => (
              <motion.div key={index} variants={serviceItemVariants}>
                <ServiceCard service={service} showPopular={index < 2} />
              </motion.div>
            ))}
          </motion.div>

          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={handleShowMore}
                asChild
              >
                <motion.button
                  whileTap={{ scale: 0.98 }}
                >
                  Показать ещё
                </motion.button>
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

