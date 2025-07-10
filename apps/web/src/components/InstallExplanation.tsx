import { Card } from '@prevezic/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@prevezic/ui/dialog';
import { useEffect, useState } from 'react';

type Platform = 'ios' | 'android' | 'desktop';

export function InstallExplanation({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [platform, setPlatform] = useState<Platform>('desktop');

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/Android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }
  }, []);

  const renderIOSInstructions = () => (
    <div className='space-y-6'>
      <div className='text-center'>
        <p className='text-sm text-gray-600 mb-4'>
          Installez l'application pour une meilleure expérience
        </p>
      </div>

      <div className='space-y-4'>
        <Card className='p-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0 w-8 h-8 bg-tertiary text-white rounded-full flex items-center justify-center text-sm font-bold'>
              1
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>Ouvrez le menu de partage</p>
              <p className='text-xs text-gray-600 mt-1'>
                Appuyez sur l'icône de partage en bas du navigateur
              </p>
            </div>
          </div>
          <div className='mt-3 rounded-lg overflow-hidden'>
            <img
              src='/ios-install-1.png'
              alt='Safari share button'
              className='w-full h-auto'
            />
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0 w-8 h-8 bg-tertiary text-white rounded-full flex items-center justify-center text-sm font-bold'>
              2
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>Ajoutez à l'écran d'accueil</p>
              <p className='text-xs text-gray-600 mt-1'>
                Sélectionnez "Sur l'écran d'accueil" dans le menu
              </p>
            </div>
          </div>
          <div className='mt-3 rounded-lg overflow-hidden'>
            <img
              src='/ios-install-2.png'
              alt='Add to home screen option'
              className='w-full h-auto'
            />
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0 w-8 h-8 bg-tertiary text-white rounded-full flex items-center justify-center text-sm font-bold'>
              3
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>Confirmez l'installation</p>
              <p className='text-xs text-gray-600 mt-1'>
                Appuyez sur "Ajouter" pour installer l'application
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAndroidInstructions = () => (
    <div className='space-y-6'>
      <div className='text-center'>
        <p className='text-sm text-gray-600 mb-4'>
          Installez l'application pour une meilleure expérience
        </p>
      </div>

      <div className='space-y-4'>
        <Card className='p-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0 w-8 h-8 bg-tertiary text-white rounded-full flex items-center justify-center text-sm font-bold'>
              1
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>
                Ouvrez le menu du navigateur
              </p>
              <p className='text-xs text-gray-600 mt-1'>
                Appuyez sur les trois points (⋮) en haut à droite
              </p>
            </div>
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0 w-8 h-8 bg-tertiary text-white rounded-full flex items-center justify-center text-sm font-bold'>
              2
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>Ajoutez à l'écran d'accueil</p>
              <p className='text-xs text-gray-600 mt-1'>
                Sélectionnez "Ajouter à l'écran d'accueil" ou "Installer
                l'application"
              </p>
            </div>
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0 w-8 h-8 bg-tertiary text-white rounded-full flex items-center justify-center text-sm font-bold'>
              3
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>Confirmez l'installation</p>
              <p className='text-xs text-gray-600 mt-1'>
                Appuyez sur "Installer" pour ajouter l'application
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderDesktopInstructions = () => (
    <div className='space-y-6'>
      <div className='text-center'>
        <h3 className='text-lg font-semibold mb-2'>Sur ordinateur</h3>
        <p className='text-sm text-gray-600 mb-4'>
          Vous pouvez installer l'application sur votre bureau
        </p>
      </div>

      <div className='space-y-4'>
        <Card className='p-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
              1
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>
                Cherchez l'icône d'installation
              </p>
              <p className='text-xs text-gray-600 mt-1'>
                Regardez dans la barre d'adresse ou le menu du navigateur
              </p>
            </div>
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex items-start space-x-3'>
            <div className='flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold'>
              2
            </div>
            <div className='flex-1'>
              <p className='text-sm font-medium'>Installez l'application</p>
              <p className='text-xs text-gray-600 mt-1'>
                Cliquez sur "Installer" ou "Ajouter à l'écran d'accueil"
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='h-full max-w-full w-full rounded-none border-none shadow-none outline-none'>
        <DialogHeader>
          <DialogTitle>Installer l'application</DialogTitle>
        </DialogHeader>

        <div className='mt-4 overflow-y-auto'>
          {platform === 'ios' && renderIOSInstructions()}
          {platform === 'android' && renderAndroidInstructions()}
          {platform === 'desktop' && renderDesktopInstructions()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
