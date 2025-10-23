'use client';

import { createContext, useState, useContext } from 'react';

// Типы для нашего контекста
type AnimationDirection = 'forward' | 'backward' | 'none';
interface AnimationContextProps {
  direction: AnimationDirection;
  setDirection: (direction: AnimationDirection) => void;
}

// Создаем контекст с начальным значением undefined
const AnimationContext = createContext<AnimationContextProps | undefined>(undefined);

// Создаем провайдер, который будет хранить состояние
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState<AnimationDirection>('none');

  return (
    <AnimationContext.Provider value={{ direction, setDirection }}>
      {children}
    </AnimationContext.Provider>
  );
}

// Создаем кастомный хук для удобного доступа к контексту
export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}