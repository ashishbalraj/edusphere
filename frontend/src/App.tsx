import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export default function App() {
  const { theme, resolvedTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [theme, resolvedTheme]);

  return <RouterProvider router={router} />;
}
