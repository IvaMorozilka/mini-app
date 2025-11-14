// Data processing utilities for services from data.json
import servicesData from './data.json';

// Type definitions based on data.json structure
export type Service = {
  направление_поддержки: string;
  наименование_услуги: string;
  описание_услуги: string;
  срок_оказания_услуги: string;
  результат_оказания_услуги: string;
  тип_услуги: string;
  категория_граждан: string;
  ссылка_на_получение_услуги: string;
  подробнее_об_услуге: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  serviceCount: number;
};

export type CitizenCategory = {
  id: string;
  name: string;
};

// Get all services
export const getAllServices = (): Service[] => {
  return servicesData as Service[];
};

// Extract unique service categories (направление_поддержки)
export const getServiceCategories = (): ServiceCategory[] => {
  const services = getAllServices();
  const categoryMap = new Map<string, { name: string; count: number }>();

  services.forEach((service) => {
    const categoryName = service.направление_поддержки;
    if (categoryName) {
      const existing = categoryMap.get(categoryName);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(categoryName, { name: categoryName, count: 1 });
      }
    }
  });

  return Array.from(categoryMap.entries()).map(([name, data], index) => {
    // Create a slug from category name for routing
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return {
      id: slug,
      name: data.name,
      description: `Меры поддержки для жителей Ленинградской области`,
      serviceCount: data.count,
    };
  });
};

// Extract unique citizen categories (категория_граждан)
export const getCitizenCategories = (): CitizenCategory[] => {
  const services = getAllServices();
  const categorySet = new Set<string>();

  services.forEach((service) => {
    if (service.категория_граждан) {
      // Split by semicolon and trim
      const categories = service.категория_граждан
        .split(';')
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);
      categories.forEach((cat) => categorySet.add(cat));
    }
  });

  const categories = Array.from(categorySet).sort();
  return [
    { id: 'all', name: 'Всем' },
    ...categories.map((name, index) => ({
      id: `citizen-${index + 1}`,
      name,
    })),
  ];
};

// Sort services: regional (Региональная) before federal (Федеральная)
export const sortServices = (services: Service[]): Service[] => {
  return [...services].sort((a, b) => {
    const aIsRegional = a.тип_услуги === 'Региональная';
    const bIsRegional = b.тип_услуги === 'Региональная';
    
    if (aIsRegional && !bIsRegional) return -1;
    if (!aIsRegional && bIsRegional) return 1;
    return 0;
  });
};

// Filter services by category and citizen category
export const filterServices = (
  services: Service[],
  categoryFilter?: string,
  citizenCategoryFilter?: string | string[]
): Service[] => {
  let filtered = [...services];

  // Filter by service category (направление_поддержки)
  if (categoryFilter && categoryFilter !== 'all') {
    const categoryName = getServiceCategories().find(
      (cat) => cat.id === categoryFilter
    )?.name;
    if (categoryName) {
      filtered = filtered.filter(
        (service) => service.направление_поддержки === categoryName
      );
    }
  }

  // Filter by citizen category (категория_граждан) - supports multiple
  if (citizenCategoryFilter) {
    const filterArray = Array.isArray(citizenCategoryFilter)
      ? citizenCategoryFilter
      : citizenCategoryFilter !== 'all'
      ? [citizenCategoryFilter]
      : [];

    if (filterArray.length > 0) {
      const citizenCategoryNames = getCitizenCategories()
        .filter((cat) => filterArray.includes(cat.id))
        .map((cat) => cat.name);

      if (citizenCategoryNames.length > 0) {
        filtered = filtered.filter((service) => {
          const serviceCategories = service.категория_граждан
            .split(';')
            .map((cat) => cat.trim());
          // Service matches if it belongs to any of the selected categories
          return citizenCategoryNames.some((name) =>
            serviceCategories.includes(name)
          );
        });
      }
    }
  }

  // Sort: regional before federal
  return sortServices(filtered);
};

// Search services by name, description, or category
export const searchServices = (
  services: Service[],
  searchQuery: string
): Service[] => {
  if (!searchQuery.trim()) {
    return services;
  }

  const query = searchQuery.toLowerCase();
  const allCategories = getServiceCategories();
  
  return services.filter(
    (service) => {
      // Search in service name
      if (service.наименование_услуги.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in service description
      if (service.описание_услуги.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in category name (направление_поддержки)
      if (service.направление_поддержки.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search in category description
      const category = allCategories.find(cat => cat.name === service.направление_поддержки);
      if (category && category.description.toLowerCase().includes(query)) {
        return true;
      }
      
      return false;
    }
  );
};

// Get services grouped by category
export const getServicesGroupedByCategory = (
  services: Service[]
): Map<string, Service[]> => {
  const grouped = new Map<string, Service[]>();

  services.forEach((service) => {
    const category = service.направление_поддержки;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(service);
  });

  return grouped;
};

// Generate a unique slug for a service based on its name and other fields
export const getServiceSlug = (service: Service): string => {
  // Create a slug from service name, making it URL-safe
  let slug = service.наименование_услуги
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  // Truncate slug to max 50 characters to avoid filesystem path length issues
  // The hash ensures uniqueness even with truncated slugs
  const MAX_SLUG_LENGTH = 50;
  if (slug.length > MAX_SLUG_LENGTH) {
    slug = slug.substring(0, MAX_SLUG_LENGTH);
    // Remove trailing dash if truncation happened in the middle of a word
    slug = slug.replace(/-+$/, '');
  }
  
  // Create a hash from multiple fields to ensure uniqueness
  const hashString = `${service.наименование_услуги}|${service.направление_поддержки}|${service.описание_услуги.substring(0, 100)}`;
  let hash = hashString
    .split('')
    .reduce((acc, char) => {
      const hash = ((acc << 5) - acc) + char.charCodeAt(0);
      return hash | 0; // Convert to 32bit integer
    }, 0);
  
  // Ensure hash is positive and convert to base36
  hash = Math.abs(hash);
  const hashStr = hash.toString(36);
  
  return `${slug}-${hashStr}`;
};

// Get service by slug
export const getServiceBySlug = (slug: string): Service | undefined => {
  const services = getAllServices();
  return services.find((service) => getServiceSlug(service) === slug);
};

// Get services by category slug
export const getServicesByCategorySlug = (categorySlug: string): Service[] => {
  const services = getAllServices();
  const categoryName = getServiceCategories().find(
    (cat) => cat.id === categorySlug
  )?.name;
  
  if (!categoryName) {
    return [];
  }
  
  return services.filter(
    (service) => service.направление_поддержки === categoryName
  );
};

// Get category by slug
export const getCategoryBySlug = (slug: string): ServiceCategory | undefined => {
  return getServiceCategories().find((cat) => cat.id === slug);
};

