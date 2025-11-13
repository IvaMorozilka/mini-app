'use client';

import { useRouter } from 'next/navigation';
import { useAnimation } from '@/context/AnimationContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service, ServiceCategory, sortServices } from '@/lib/services';
import ServiceCard from './ServiceCard';
import { ArrowRight } from 'lucide-react';

type CategorySectionProps = {
  category: ServiceCategory;
  services: Service[];
  initialShowCount?: number;
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
    <Card className="mb-6 bg-background border shadow-sm">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors border-b bg-muted/20"
        onClick={handleCategoryClick}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-semibold">
                {category.name}
              </CardTitle>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">
                {category.serviceCount} {category.serviceCount === 1 ? 'услуга' : category.serviceCount < 5 ? 'услуги' : 'услуг'}
              </span>
            </div>
            <CardDescription className="text-sm">
              {category.description}
            </CardDescription>
          </div>
          <ArrowRight className="size-5 text-muted-foreground shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="pt-6 bg-muted/10">
        <div className="space-y-3">
          {displayedServices.map((service, index) => (
            <ServiceCard key={index} service={service} showPopular={index < 2} />
          ))}
        </div>

        {hasMore && (
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={handleShowMore}
          >
            Показать ещё
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

