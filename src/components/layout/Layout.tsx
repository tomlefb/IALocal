import { useState, type ReactNode, cloneElement, isValidElement } from 'react';
import { cn } from '@/utils';
import { SIDEBAR_WIDTH } from '@/utils/constants';
import { Header } from './Header';

export interface LayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  onOpenSettings: () => void;
}

export function Layout({ children, sidebar, onOpenSettings }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Clone sidebar element to inject closeSidebar function
  const sidebarWithClose = isValidElement(sidebar)
    ? cloneElement(sidebar as React.ReactElement<{ onClose?: () => void }>, {
        onClose: closeSidebar,
      })
    : sidebar;

  return (
    <div className="h-screen flex overflow-hidden bg-bg-primary">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col flex-shrink-0',
          'bg-bg-secondary border-r border-border-subtle'
        )}
        style={{ width: SIDEBAR_WIDTH }}
      >
        {sidebarWithClose}
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          {/* Sidebar mobile */}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-50 flex flex-col md:hidden',
              'bg-bg-secondary border-r border-border-subtle',
              'animate-slide-in-left'
            )}
            style={{ width: SIDEBAR_WIDTH }}
          >
            {sidebarWithClose}
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSettings={onOpenSettings}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
