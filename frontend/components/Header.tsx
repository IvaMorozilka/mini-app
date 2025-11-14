'use client';

import { useRouter } from 'next/navigation';
import { useAnimation } from '@/context/AnimationContext'; // <-- Наш хук
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

type HeaderProps = {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
};

export default function Header({ title, subtitle, showBackButton = false }: HeaderProps) {
    const router = useRouter();
    const { setDirection } = useAnimation();

    const handleBack = () => {
        setDirection('backward'); // 1. Устанавливаем направление
        router.back(); // 2. Возвращаемся назад
    };

    return (
        <header className='sticky top-0 z-20 flex flex-col gap-1 pb-4 pt-3 -mt-3 -mx-3 px-3 bg-background/95 backdrop-blur-sm border-b border-border/50'>
            {showBackButton && (
                <Button onClick={handleBack} variant={'ghost'} size="icon" className="self-start mb-1">
                    <ArrowLeft className="size-5"/>
                </Button>
            )}
            <div className="flex flex-col gap-1">
                <h1 className='text-left font-bold text-2xl leading-tight'>{title}</h1>
                {subtitle && (
                    <p className='text-sm text-muted-foreground leading-tight'>{subtitle}</p>
                )}
            </div>
        </header>
    );
}