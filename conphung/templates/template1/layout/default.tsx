import { ReactNode } from 'react';

interface Template1LayoutProps {
  children: ReactNode;
}

export default function Template1Layout({ children }: Template1LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

