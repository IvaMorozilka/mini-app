import { getAllServices, getServiceSlug } from '@/lib/services';
import ServicePageClient from './ServicePageClient';

export function generateStaticParams() {
  const services = getAllServices();
  return services.map((service) => ({
    slug: getServiceSlug(service),
  }));
}

export default function ServicePage() {
  return <ServicePageClient />;
}
