'use client';

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { getServiceBySlug, getAllServices, type Service } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Info, List, CheckCircle, ExternalLink } from 'lucide-react';

// Оптимизированные варианты для мобильных
const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 0.5,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

export default function ServicePage() {
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
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Header title={service.наименование_услуги} showBackButton={true} />
      </motion.div>
      
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Info Card */}
        <motion.div variants={cardVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <motion.div
                  className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span className="text-primary font-bold text-lg">Φ</span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold mb-2">
                    {service.наименование_услуги}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {service.описание_услуги}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Service Details */}
        <div className="space-y-4">
          {/* Service Delivery Time */}
          {service.срок_оказания_услуги && (
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Clock className="size-5 text-primary" />
                    </motion.div>
                    <CardTitle className="text-base font-semibold">
                      Срок оказания услуги
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{service.срок_оказания_услуги}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Documents */}
          {service.категория_граждан && (
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.18, type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <FileText className="size-5 text-primary" />
                    </motion.div>
                    <CardTitle className="text-base font-semibold">
                      Категория граждан
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.категория_граждан.split(';').map((category, index) => (
                      <motion.p
                        key={index}
                        className="text-sm"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.03 }}
                      >
                        • {category.trim()}
                      </motion.p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Service Type */}
          {service.тип_услуги && (
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Info className="size-5 text-primary" />
                    </motion.div>
                    <CardTitle className="text-base font-semibold">
                      Тип услуги
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{service.тип_услуги}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Result */}
          {service.результат_оказания_услуги && (
            <motion.div variants={cardVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.22, type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <CheckCircle className="size-5 text-primary" />
                    </motion.div>
                    <CardTitle className="text-base font-semibold">
                      Результат
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{service.результат_оказания_услуги}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 400, damping: 30, mass: 0.5 }}
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


