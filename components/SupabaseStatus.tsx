'use client';

import React, { useEffect, useState } from 'react';
import { Database, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured, getSupabase } from '@/lib/supabase';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error' | 'not-configured'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      if (!isSupabaseConfigured()) {
        setStatus('not-configured');
        return;
      }

      try {
        const supabase = getSupabase();
        // A simple query to check connection
        const { error: connError } = await supabase.from('_test_connection').select('*').limit(1).maybeSingle();
        
        // Note: _test_connection might not exist, which is fine, we just want to see if the request reaches Supabase
        // If it's a 401/403 or network error, it's a real error.
        // A "table not found" error (42P01 / PGRST205) actually means we ARE connected.
        
        if (connError && connError.code !== '42P01' && connError.code !== 'PGRST205') {
          throw connError;
        }
        
        setStatus('connected');
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setError(err.message || 'Failed to connect to Supabase');
        setStatus('error');
      }
    }

    checkConnection();
  }, []);

  if (status === 'loading') return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-in slide-in-from-right-full duration-500">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full border shadow-lg backdrop-blur-md ${
        status === 'connected' 
          ? 'bg-green-50/80 border-green-200 text-green-700 dark:bg-green-900/40 dark:border-green-800 dark:text-green-400' 
          : status === 'not-configured'
          ? 'bg-amber-50/80 border-amber-200 text-amber-700 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-400'
          : 'bg-red-50/80 border-red-200 text-red-700 dark:bg-red-900/40 dark:border-red-800 dark:text-red-400'
      }`}>
        <Database size={14} className={status === 'connected' ? 'animate-pulse' : ''} />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {status === 'connected' ? 'Supabase Linked' : status === 'not-configured' ? 'Supabase Setup Needed' : 'Supabase Error'}
        </span>
        {status === 'connected' ? (
          <CheckCircle2 size={12} />
        ) : status === 'not-configured' ? (
          <AlertTriangle size={12} />
        ) : (
          <XCircle size={12} />
        )}
      </div>
    </div>
  );
}
