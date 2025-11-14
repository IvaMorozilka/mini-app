'use client';

import BottomMenu from '@/components/BottomMenu';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAnimation } from '@/context/AnimationContext';
import { useEffect, useRef } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { direction, resetDirection } = useAnimation();
  const prevPathnameRef = useRef(pathname);

  // Оптимизированные варианты анимации для мобильных (только transform и opacity)
  const variants = {
    forwardInitial: { 
      x: '100%', 
      opacity: 0,
    },
    forwardEnter: { 
      x: 0, 
      opacity: 1,
    },
    forwardExit: { 
      x: '-100%', 
      opacity: 0,
    },
    backwardInitial: { 
      x: '-100%', 
      opacity: 0,
    },
    backwardEnter: { 
      x: 0, 
      opacity: 1,
    },
    backwardExit: { 
      x: '100%', 
      opacity: 0,
    },
  };

  // Оптимизированная spring transition для мобильных устройств
  const springTransition = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 35,
    mass: 0.6,
  };

  // Быстрый tween transition для мгновенных переходов
  const tweenTransition = {
    type: 'tween' as const,
    ease: [0.25, 0.1, 0.25, 1] as const, // Оптимизированная кривая для мобильных
    duration: 0.2,
  };

  // Определяем, нужно ли использовать анимацию перехода
  const shouldAnimate = direction !== 'none';
  const currentDirection = shouldAnimate ? direction : 'none';
  const enterCompleteRef = useRef(false);

  // Сбрасываем флаг при изменении pathname
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      enterCompleteRef.current = false;
    }
  }, [pathname]);

  // Обработчик завершения enter анимации
  const handleEnterComplete = () => {
    if (shouldAnimate && !enterCompleteRef.current) {
      enterCompleteRef.current = true;
      // Сбрасываем направление после завершения enter анимации
      resetDirection();
    }
  };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-lg flex-col bg-background shadow-lg safe-area-inset">
      {/* Сцена для анимаций */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={pathname}
            className="scroll-area absolute h-full w-full overflow-y-auto overflow-x-hidden p-3 bg-background"
            variants={variants}
            initial={
              currentDirection === 'forward'
                ? 'forwardInitial'
                : currentDirection === 'backward'
                ? 'backwardInitial'
                : false
            }
            animate={
              currentDirection === 'forward'
                ? 'forwardEnter'
                : currentDirection === 'backward'
                ? 'backwardEnter'
                : false
            }
            exit={
              currentDirection === 'forward'
                ? 'forwardExit'
                : currentDirection === 'backward'
                ? 'backwardExit'
                : undefined
            }
            transition={shouldAnimate ? springTransition : tweenTransition}
            onAnimationComplete={(definition) => {
              // Сбрасываем направление только после завершения enter анимации
              if (shouldAnimate && (definition === 'forwardEnter' || definition === 'backwardEnter')) {
                handleEnterComplete();
              }
            }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>

      <BottomMenu />
    </div>
  );
}