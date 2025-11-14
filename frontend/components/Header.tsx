'use client';

import { useRouter } from 'next/navigation';
import { useAnimation } from '@/context/AnimationContext'; // <-- Наш хук
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

type HeaderProps = {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    rightSide?: React.ReactNode;
};

export default function Header({ title, subtitle, showBackButton = false, rightSide }: HeaderProps) {
    const router = useRouter();
    const { setDirection } = useAnimation();

    const handleBack = () => {
        setDirection('backward'); // 1. Устанавливаем направление
        router.back(); // 2. Возвращаемся назад
    };

    return (
        <header className='flex flex-col gap-1 pb-4 pt-3 px-3'>
            {showBackButton && (
                <Button onClick={handleBack} variant={'ghost'} size="icon" className="self-start mb-1">
                    <ArrowLeft className="size-5"/>
                </Button>
            )}
            <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <h1 className='text-left font-bold text-2xl leading-tight'>{title}</h1>
                    {subtitle && (
                        <p className='text-sm text-muted-foreground leading-tight'>{subtitle}</p>
                    )}
                </div>
                {rightSide && (
                    <div className="flex-shrink-0 pt-1">
                        {rightSide}
                    </div>
                )}
            </div>
        </header>
    );
}