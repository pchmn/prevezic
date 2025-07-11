import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { isPwa } from '~/lib/cache-storage/cache-storage';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallationPromptContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isInstalled: boolean;
  showInstallPrompt: () => Promise<boolean>;
  hideInstallPrompt: () => void;
}

const InstallationPromptContext =
  createContext<InstallationPromptContextType | null>(null);

interface InstallationPromptProviderProps {
  children: ReactNode;
}

export function InstallationPromptProvider({
  children,
}: InstallationPromptProviderProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(isPwa());

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const showInstallPrompt = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.warn('No deferred prompt found');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  };

  const hideInstallPrompt = () => {
    setDeferredPrompt(null);
  };

  const value: InstallationPromptContextType = {
    deferredPrompt,
    isInstallable: !!deferredPrompt && !isInstalled,
    isInstalled,
    showInstallPrompt,
    hideInstallPrompt,
  };

  return (
    <InstallationPromptContext.Provider value={value}>
      {children}
    </InstallationPromptContext.Provider>
  );
}

export function useInstallationPrompt() {
  const context = useContext(InstallationPromptContext);
  if (!context) {
    throw new Error(
      'useInstallationPrompt must be used within an InstallationPromptProvider',
    );
  }
  return context;
}

// Convenience hook for just checking if the app is installable
export function useIsInstallable() {
  const { isInstallable } = useInstallationPrompt();
  return isInstallable;
}

// Convenience hook for just checking if the app is installed
export function useIsInstalled() {
  const { isInstalled } = useInstallationPrompt();
  return isInstalled;
}
