// components/BottomMenu.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAnimation } from '@/context/AnimationContext';
import { Button } from '@/components/ui/button';
import { LayoutGrid, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomMenu() {
  const { setDirection } = useAnimation();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full border-t bg-background flex justify-around items-center py-2">
      <Button 
        asChild 
        variant="ghost" 
        className={cn(
          "h-12 flex-1 flex-col gap-1",
          isActive('/') && "text-primary"
        )}
      >
        <Link href="/" onClick={() => setDirection('none')}>
          <LayoutGrid className={cn("size-5", isActive('/') && "text-primary")} />
          <span className="text-xs">Разделы</span>
        </Link>
      </Button>

      <Button 
        asChild 
        variant="ghost" 
        className={cn(
          "h-12 flex-1 flex-col gap-1",
          isActive('/chat') && "text-primary"
        )}
      >
        <Link href="/chat" onClick={() => setDirection('none')}>
          <MessageSquare className={cn("size-5", isActive('/chat') && "text-primary")} />
          <span className="text-xs">Чат-бот</span>
        </Link>
      </Button>

      <Button 
        asChild 
        variant="ghost" 
        className={cn(
          "h-12 flex-1 flex-col gap-1",
          isActive('/profile') && "text-primary"
        )}
      >
        <Link href="/profile" onClick={() => setDirection('none')}>
          <User className={cn("size-5", isActive('/profile') && "text-primary")} />
          <span className="text-xs">Профиль</span>
        </Link>
      </Button>
    </nav>
  );
}