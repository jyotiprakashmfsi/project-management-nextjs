'use client';

import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center gap-2 p-4 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'light' 
            ? 'bg-white text-amber-500 shadow-sm' 
            : 'text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:text-neutral-400'
        }`}
        aria-label="Light mode"
      >
        <FiSun className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'dark' 
            ? 'bg-neutral-900 text-indigo-400 shadow-sm' 
            : 'text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:text-neutral-400'
        }`}
        aria-label="Dark mode"
      >
        <FiMoon className="w-5 h-5" />
      </button>
    </div>
  );
}
