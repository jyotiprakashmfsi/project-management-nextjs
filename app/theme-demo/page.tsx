import React from 'react';
import ThemeDemo from '@/components/theme/ThemeDemo';
import { ThemeProvider } from '@/context/ThemeContext';

export default function ThemeDemoPage() {
  return (
    <ThemeProvider>
      <ThemeDemo />
    </ThemeProvider>
  );
}
