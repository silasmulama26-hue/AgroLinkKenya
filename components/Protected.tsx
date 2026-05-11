'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AuthCard } from './auth/AuthCard';
import { Loader2 } from 'lucide-react';

interface ProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Protected({ children, fallback }: ProtectedProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-zinc-900 dark:text-zinc-100" size={32} />
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
        <AuthCard />
      </div>
    );
  }

  return <>{children}</>;
}
