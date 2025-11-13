'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAnimation } from '@/context/AnimationContext';

type Category = {
  id: string;
  name: string;
};

export default function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();
  const { setDirection } = useAnimation();

  const handleClick = () => {
    setDirection('forward');
    router.push(`/category/${category.id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="p-8 border border-border rounded-lg mb-4 cursor-pointer bg-card active:bg-accent/50 transition-colors"
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.5,
      }}
    >
      <h3 className="font-semibold text-lg">{category.name}</h3>
    </motion.div>
  );
}