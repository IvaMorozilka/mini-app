// components/BottomMenu.tsx
'use client';

import Link from 'next/link';
import { useAnimation } from '@/context/AnimationContext';
import { Button } from '@/components/ui/button';

export default function BottomMenu() {
  const { setDirection } = useAnimation();

  return (
    <nav
      className="
        w-full                             // Остается на всю ширину
        p-2 border-t bg-background         // Стилизация
        flex justify-around items-center   // Внутреннее выравнивание
      "
    >
      {/* ... ваши кнопки с asChild ... */}
      <Button asChild variant="ghost" className="h-12 flex-1">
        <Link href="/" onClick={() => setDirection('none')}>
          Главная
        </Link>
      </Button>

      <Button asChild variant="ghost" className="h-12 flex-1">
        <Link href="/chat" onClick={() => setDirection('none')}>
          Чат
        </Link>
      </Button>

      <Button asChild variant="ghost" className="h-12 flex-1">
        <Link href="/profile" onClick={() => setDirection('none')}>
          Профиль
        </Link>
      </Button>
    </nav>
  );
}