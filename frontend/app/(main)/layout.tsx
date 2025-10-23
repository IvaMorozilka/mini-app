'use client';

import BottomMenu from '@/components/BottomMenu';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAnimation } from '@/context/AnimationContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { direction } = useAnimation();
  const variants = {
    forwardInitial: { x: '100%', opacity: 0 },
    forwardEnter: { x: 0, opacity: 1 },
    forwardExit: { x: '-100%', opacity: 0 },
    backwardInitial: { x: '-100%', opacity: 0 },
    backwardEnter: { x: 0, opacity: 1 },
    backwardExit: { x: '100%', opacity: 0 },
  };

  return (
    // 1. Наш надежный flex-каркас. Он НЕ меняется.
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background shadow-lg">
      
      {/* 2. "Сцена" для анимаций. Она занимает всё доступное место. */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {/* 3. Анимируемый контент. Он позиционируется АБСОЛЮТНО внутри "сцены". */}
          <motion.main
            key={pathname}
            className="absolute h-full w-full overflow-y-auto p-4" // <-- КЛЮЧЕВЫЕ ИЗМЕНЕНИЯ!
            variants={variants}
            initial={
              direction === 'forward'
                ? 'forwardInitial'
                : direction === 'backward'
                ? 'backwardInitial'
                : {}
            }
            animate={direction !== 'none' ? 'forwardEnter' : {}}
            exit={
              direction === 'forward'
                ? 'forwardExit'
                : direction === 'backward'
                ? 'backwardExit'
                : {}
            }
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.15 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* 4. Меню по-прежнему является частью flex-каркаса и не затрагивается анимацией. */}
      <BottomMenu />
    </div>
  );
}