// components/BottomMenu.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAnimation } from '@/context/AnimationContext';
import { Button } from '@/components/ui/button';
import { LayoutGrid, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomMenu() {
  const { setDirection } = useAnimation();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { path: '/', icon: LayoutGrid, label: 'Разделы' },
    { path: '/chat', icon: MessageSquare, label: 'Чат-бот' },
    { path: '/profile', icon: User, label: 'Профиль' },
  ];

  return (
    <motion.nav
      className="w-full border-t bg-background flex justify-around items-center py-2"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.6,
        delay: 0.05,
      }}
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.05 + index * 0.03,
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.5,
            }}
          >
            <Button 
              asChild 
              variant="ghost" 
              className={cn(
                "h-12 flex-1 flex-col gap-1 relative",
                active && "text-primary"
              )}
            >
              <Link href={item.path} onClick={() => setDirection('none')}>
                {active && (
                  <motion.div
                    className="absolute inset-0 bg-primary/10 rounded-md"
                    layoutId="activeTab"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 35,
                      mass: 0.5,
                    }}
                  />
                )}
                <motion.div
                  className="relative z-10"
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className={cn("size-5", active && "text-primary")} />
                </motion.div>
                <span className="text-xs relative z-10">{item.label}</span>
              </Link>
            </Button>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}