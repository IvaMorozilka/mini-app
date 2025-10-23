'use client';

import { useRouter } from 'next/navigation';
import { useAnimation } from '@/context/AnimationContext'; // <-- Наш хук
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

type HeaderProps = {
    title: string;
    showBackButton?: boolean;
};

export default function Header({ title, showBackButton = false }: HeaderProps) {
    const router = useRouter();
    const { setDirection } = useAnimation();

    const handleBack = () => {
        setDirection('backward'); // 1. Устанавливаем направление
        router.back(); // 2. Возвращаемся назад
    };

    return (
        <header className='flex justify-items-start items-start gap-2 pb-2'>
            {showBackButton && (
                <Button onClick={handleBack} variant={'outline'}>
                    <ArrowLeft/>
                    Назад
                </Button>
            )}
            <h1 className='text-left font-bold text-2xl leading-none m-0 translate-y-[-5px]'>{title}</h1>
        </header>
    );
}