'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAnimation } from '@/context/AnimationContext';
import { ArrowRight } from 'lucide-react';
import { Service, getServiceSlug } from '@/lib/services';

type ServiceCardProps = {
  service: Service;
  showPopular?: boolean;
};

export default function ServiceCard({ service, showPopular = false }: ServiceCardProps) {
  const router = useRouter();
  const { setDirection } = useAnimation();

  const handleClick = () => {
    setDirection('forward');
    const slug = getServiceSlug(service);
    router.push(`/service/${slug}`);
  };

  // Get service type indicator
  const serviceType = service.тип_услуги === 'Региональная' ? 'Р' : 'Ф';

  return (
    <motion.div
      className="flex items-center justify-between p-3 rounded-md cursor-pointer active:bg-accent/50 transition-colors border border-transparent relative bg-muted/30"
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.5,
      }}
    >
      {showPopular && (
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-1 h-8 bg-primary rounded-r-full"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.1, duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      )}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Service type indicator */}
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary font-bold text-sm">{serviceType}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base mb-1 line-clamp-1">
            {service.наименование_услуги}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.описание_услуги}
          </p>
        </div>
      </div>
      <ArrowRight className="size-5 text-muted-foreground shrink-0 ml-3" />
    </motion.div>
  );
}

