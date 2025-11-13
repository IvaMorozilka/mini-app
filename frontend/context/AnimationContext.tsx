'use client';

import { createContext, useState, useContext, useRef } from 'react';

// Типы для нашего контекста
type AnimationDirection = 'forward' | 'backward' | 'none';
interface AnimationContextProps {
  direction: AnimationDirection;
  setDirection: (direction: AnimationDirection) => void;
  resetDirection: () => void;
}

// Создаем контекст с начальным значением undefined
const AnimationContext = createContext<AnimationContextProps | undefined>(undefined);

// Создаем провайдер, который будет хранить состояние
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirectionState] = useState<AnimationDirection>('none');
  const directionRef = useRef<AnimationDirection>('none');

  // Обновляем и ref, и state
  const setDirection = (newDirection: AnimationDirection) => {
    directionRef.current = newDirection;
    setDirectionState(newDirection);
  };

  // Функция для сброса направления (вызывается после завершения анимации)
  const resetDirection = () => {
    directionRef.current = 'none';
    setDirectionState('none');
  };

  return (
    <AnimationContext.Provider value={{ direction, setDirection, resetDirection }}>
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