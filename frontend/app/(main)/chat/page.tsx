'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function ChatPage() {
  return (
    <>
      {/* Sticky Header and Search Block */}
      <motion.div
        className="sticky top-0 z-20 -mx-3 bg-background/95 backdrop-blur-sm border-b border-border/50"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Header title="Чат" />
        {/* Search Input */}
        <div className="px-3 pt-2 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск..."
              className="pl-9"
            />
          </div>
        </div>
      </motion.div>

      <div style={{ padding: '1rem' }}>
        <p>Это страница c чатом ИИ.</p>
      </div>
    </>
  );
}