'use client';
import { AnimationProvider } from '@/context/AnimationContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AnimationProvider>{children}</AnimationProvider>;
}