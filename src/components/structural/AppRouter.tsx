import React, { useState, useEffect } from 'react';
import { AppStructure, RoutingConfig, ComponentTomeMapping } from './app-structure';

interface RouterProps {
  initialRoute?: string;
  onRouteChange?: (route: string) => void;
}

interface RouteContext {
  currentRoute: string;
  params: Record<string, string>;
  navigate: (route: string) => void;
  goBack: () => void;
}

export const RouteContext = React.createContext<RouteContext | null>(null);

export const AppRouter: React.FC<RouterProps> = ({ 
  initialRoute = '/wave-tabs',
  onRouteChange 
}) => {
  const [currentRoute, setCurrentRoute] = useState(initialRoute);
  const [routeHistory, setRouteHistory] = useState<string[]>([initialRoute]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation functions
  const navigate = (route: string) => {
    if (route === currentRoute) return;
    
    const newHistory = routeHistory.slice(0, currentIndex + 1);
    newHistory.push(route);
    
    setRouteHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    setCurrentRoute(route);
    
    onRouteChange?.(route);
    
    // Update browser history
    window.history.pushState({ route }, '', route);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newRoute = routeHistory[newIndex];
      setCurrentIndex(newIndex);
      setCurrentRoute(newRoute);
      onRouteChange?.(newRoute);
      
      // Update browser history
      window.history.pushState({ route: newRoute }, '', newRoute);
    }
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.route) {
        setCurrentRoute(event.state.route);
        onRouteChange?.(event.state.route);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onRouteChange]);

  // Find route configuration
  const findRoute = (path: string) => {
    const findRouteRecursive = (routes: any[], targetPath: string): any => {
      for (const route of routes) {
        if (route.path === targetPath) {
          return route;
        }
        if (route.children) {
          const found = findRouteRecursive(route.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };

    return findRouteRecursive(RoutingConfig.routes, path);
  };

  // Get component for current route
  const getComponentForRoute = (route: string) => {
    const routeConfig = findRoute(route);
    if (!routeConfig) return null;

    const componentName = routeConfig.component;
    const componentMapping = ComponentTomeMapping[componentName as keyof typeof ComponentTomeMapping];
    
    if (!componentMapping) {
      console.warn(`No component mapping found for: ${componentName}`);
      return null;
    }

    // Dynamic import of component
    try {
      // This would need to be adjusted based on your actual component structure
      const Component = React.lazy(() => import(componentMapping.componentPath));
      return Component;
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
      return null;
    }
  };

  // Render breadcrumb navigation
  const renderBreadcrumbs = () => {
    const pathSegments = currentRoute.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      return (
        <span key={path}>
          {index > 0 && <span className="breadcrumb-separator"> / </span>}
          <button 
            className="breadcrumb-link"
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        </span>
      );
    });

    return (
      <nav className="breadcrumb-navigation">
        <button 
          className="breadcrumb-link"
          onClick={() => navigate('/')}
        >
          Home
        </button>
        {breadcrumbs}
      </nav>
    );
  };

  // Render navigation menu
  const renderNavigation = () => {
    const renderNavItems = (items: any[]) => {
      return items.map(item => (
        <div key={item.id} className="nav-item">
          <button
            className={`nav-button ${currentRoute === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
          {item.children && (
            <div className="nav-children">
              {renderNavItems(item.children)}
            </div>
          )}
        </div>
      ));
    };

    return (
      <nav className="app-navigation">
        <div className="nav-section">
          <h3>Primary Navigation</h3>
          {renderNavItems(RoutingConfig.navigation.primary)}
        </div>
        <div className="nav-section">
          <h3>Secondary Navigation</h3>
          {renderNavItems(RoutingConfig.navigation.secondary)}
        </div>
      </nav>
    );
  };

  // Get current route component
  const CurrentComponent = getComponentForRoute(currentRoute);

  const routeContext: RouteContext = {
    currentRoute,
    params: {}, // TODO: Implement parameter extraction
    navigate,
    goBack
  };

  return (
    <RouteContext.Provider value={routeContext}>
      <div className="app-router">
        <header className="router-header">
          <h1>Wave Reader</h1>
          {renderBreadcrumbs()}
        </header>
        
        <div className="router-content">
          <aside className="router-sidebar">
            {renderNavigation()}
          </aside>
          
          <main className="router-main">
            {CurrentComponent ? (
              <React.Suspense fallback={<div>Loading...</div>}>
                <CurrentComponent />
              </React.Suspense>
            ) : (
              <div className="route-not-found">
                <h2>Route Not Found</h2>
                <p>The requested route "{currentRoute}" could not be found.</p>
                <button onClick={() => navigate('/wave-tabs')}>
                  Go to Home
                </button>
              </div>
            )}
          </main>
        </div>
        
        <footer className="router-footer">
          <button 
            className="back-button"
            onClick={goBack}
            disabled={currentIndex === 0}
          >
            ← Back
          </button>
          <span className="current-route">
            Current: {currentRoute}
          </span>
        </footer>
      </div>
    </RouteContext.Provider>
  );
};

// Hook to use router context
export const useRouter = () => {
  const context = React.useContext(RouteContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouteContext.Provider');
  }
  return context;
};

export default AppRouter;
