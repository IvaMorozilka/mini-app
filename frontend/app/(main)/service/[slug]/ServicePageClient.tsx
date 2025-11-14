'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { getServiceBySlug, getAllServices, type Service } from '@/lib/services';
import { Button } from '@/components/ui/button';
import { Clock, FileText, CheckCircle, ExternalLink } from 'lucide-react';

export default function ServicePageClient() {
  const params = useParams();
  const [service, setService] = useState<Service | undefined>(undefined);
  const [loading, setLoading] = useState(true);

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
      
      // Ensure data is loaded
      const allServices = getAllServices();
      if (allServices.length === 0) {
        console.error('No services loaded');
        setService(undefined);
        setLoading(false);
        return;
      }
      
      const foundService = getServiceBySlug(decodedSlug);
      setService(foundService);
      setLoading(false);
      
      if (!foundService) {
        console.error('Service not found for slug:', decodedSlug);
      }
    }
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <Header title="Загрузка..." showBackButton={true} />
        <div className="p-4">
          <p>Загрузка услуги...</p>
        </div>
      </>
    );
  }

  if (!service) {
    return (
      <>
        <Header title="Услуга не найдена" showBackButton={true} />
        <div className="p-4">
          <p>Услуга не найдена. Пожалуйста, вернитесь на главную страницу.</p>
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
        <Header title={service.наименование_услуги} showBackButton={true} />
      </motion.div>
      
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Service Type Indicator */}
        <motion.div
          className="flex items-center gap-2.5 mb-3"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-xs">
              {service.тип_услуги === 'Региональная' ? 'Р' : 'Ф'}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">{service.тип_услуги}</span>
        </motion.div>

        {/* Description */}
        {service.описание_услуги && (
          <motion.p
            className="text-sm text-foreground leading-relaxed"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {service.описание_услуги}
          </motion.p>
        )}

        {/* Service Delivery Time */}
        {service.срок_оказания_услуги && (
          <motion.div
            className="pt-3 border-t border-border/50"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-2.5 mb-2">
              <Clock className="size-4 text-primary mt-0.5 shrink-0" />
              <h3 className="text-sm font-semibold">Срок оказания услуги</h3>
            </div>
            <p className="text-sm text-foreground ml-7">{service.срок_оказания_услуги}</p>
          </motion.div>
        )}

        {/* Category of Citizens */}
        {service.категория_граждан && (
          <motion.div
            className="pt-3 border-t border-border/50"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-start gap-2.5 mb-2">
              <FileText className="size-4 text-primary mt-0.5 shrink-0" />
              <h3 className="text-sm font-semibold">Категория граждан</h3>
            </div>
            <div className="space-y-1.5 ml-7">
              {service.категория_граждан.split(';').map((category, index) => (
                <p key={index} className="text-sm text-foreground">
                  • {category.trim()}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Result */}
        {service.результат_оказания_услуги && (
          <motion.div
            className="pt-3 border-t border-border/50"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-start gap-2.5 mb-2">
              <CheckCircle className="size-4 text-primary mt-0.5 shrink-0" />
              <h3 className="text-sm font-semibold">Результат</h3>
            </div>
            <p className="text-sm text-foreground ml-7">{service.результат_оказания_услуги}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="space-y-3 pt-4 border-t border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, type: 'spring' as const, stiffness: 400, damping: 30, mass: 0.5 }}
        >
          {service.ссылка_на_получение_услуги && (
            <Button
              className="w-full"
              onClick={() => window.open(service.ссылка_на_получение_услуги, '_blank')}
              asChild
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
              >
                Получить услугу
                <ExternalLink className="size-4 ml-2" />
              </motion.button>
            </Button>
          )}
          
          {service.подробнее_об_услуге && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(service.подробнее_об_услуге, '_blank')}
              asChild
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
              >
                Подробнее об услуге
                <ExternalLink className="size-4 ml-2" />
              </motion.button>
            </Button>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
