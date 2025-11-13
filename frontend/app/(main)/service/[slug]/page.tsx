'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { getServiceBySlug, getAllServices, type Service } from '@/lib/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, FileText, Info, List, CheckCircle, ExternalLink } from 'lucide-react';

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
      <Header title={service.наименование_услуги} showBackButton={true} />
      
      <div className="space-y-6">
        {/* Main Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-lg">Φ</span>
              </div>
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

        {/* Service Details */}
        <div className="space-y-4">
          {/* Service Delivery Time */}
          {service.срок_оказания_услуги && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    Срок оказания услуги
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{service.срок_оказания_услуги}</p>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {service.категория_граждан && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    Категория граждан
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {service.категория_граждан.split(';').map((category, index) => (
                    <p key={index} className="text-sm">
                      • {category.trim()}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Type */}
          {service.тип_услуги && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Info className="size-5 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    Тип услуги
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{service.тип_услуги}</p>
              </CardContent>
            </Card>
          )}

          {/* Result */}
          {service.результат_оказания_услуги && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 text-primary" />
                  <CardTitle className="text-base font-semibold">
                    Результат
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{service.результат_оказания_услуги}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {service.ссылка_на_получение_услуги && (
            <Button
              className="w-full"
              onClick={() => window.open(service.ссылка_на_получение_услуги, '_blank')}
            >
              Получить услугу
              <ExternalLink className="size-4 ml-2" />
            </Button>
          )}
          
          {service.подробнее_об_услуге && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(service.подробнее_об_услуге, '_blank')}
            >
              Подробнее об услуге
              <ExternalLink className="size-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}


