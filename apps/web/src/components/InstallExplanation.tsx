import { Button } from '@prevezic/ui/button';
import { Card } from '@prevezic/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@prevezic/ui/drawer';
import { Flex } from '@prevezic/ui/flex';
import { cn } from '@prevezic/ui/utils';
import { CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type Platform = 'ios' | 'android' | 'desktop';

export function InstallExplanation({
  invitationToken,
  open,
  onOpenChange,
}: {
  invitationToken: string;
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Installer l'application</DrawerTitle>
          <DrawerDescription>
            Installez l'application pour une meilleure expérience
          </DrawerDescription>
        </DrawerHeader>

        <div className='mb-4 p-4 overflow-y-auto'>
          {platform === 'ios' && (
            <Flex direction='col' gap='lg'>
              <Flex align='center' gap='md'>
                <Flex align='center' className='w-[30px]'>
                  <AddToHomeScreenIcon className='hidden' />
                </Flex>
                <Flex direction='col' gap='sm'>
                  <span className='text-sm'>
                    <span className='font-bold'>1.</span> Copier le code
                    d'invitation
                  </span>
                  <Flex align='center' gap='sm' className='ml-3'>
                    <Button variant='outline' size='sm' disabled>
                      {invitationToken}
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        navigator.clipboard.writeText(invitationToken);
                      }}
                    >
                      <CopyIcon className='w-4 h-4' />
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              <Flex align='center' gap='md'>
                <Flex align='center' justify='center' className='w-[30px]'>
                  <ShareIcon />
                </Flex>
                <span className='text-sm'>
                  <span className='font-bold'>2.</span> Cliquer sur le bouton de
                  partage du navigateur
                </span>
              </Flex>

              <Flex align='center' gap='md'>
                <Flex align='center' justify='center' className='w-[30px]'>
                  <AddToHomeScreenIcon />
                </Flex>
                <span className='text-sm'>
                  <span className='font-bold'>3.</span> Cliquer sur "Sur l'écran
                  d'accueil"
                </span>
              </Flex>
            </Flex>
          )}
          {platform === 'android' && (
            <Flex direction='col' gap='lg'>
              <Flex align='center' gap='md'>
                <Flex align='center' className='w-[30px]'>
                  <AddToHomeScreenIcon className='hidden' />
                </Flex>
                <Flex direction='col' gap='sm'>
                  <span className='text-sm'>
                    <span className='font-bold'>1.</span> Copier le code
                    d'invitation
                  </span>
                  <Flex align='center' gap='sm' className='ml-3'>
                    <Button variant='outline' size='sm' disabled>
                      {invitationToken}
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        navigator.clipboard.writeText(invitationToken);
                      }}
                    >
                      <CopyIcon className='w-4 h-4' />
                    </Button>
                  </Flex>
                </Flex>
              </Flex>

              <Flex align='center' gap='md'>
                <Flex align='center' justify='center' className='w-[30px]'>
                  <BrowserMenuIcon />
                </Flex>
                <span className='text-sm'>
                  <span className='font-bold'>2.</span> Ouvrir le menu du
                  navigateur
                </span>
              </Flex>

              <Flex align='center' gap='md'>
                <Flex align='center' justify='center' className='w-[30px]'>
                  <AddToHomeScreenIconAndroid />
                </Flex>
                <span className='text-sm'>
                  <span className='font-bold'>3.</span> Cliquer sur "Ajouter à
                  l'écran d'accueil"
                </span>
              </Flex>
            </Flex>
          )}

          {platform === 'desktop' && renderDesktopInstructions()}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 17.695 26.475'
      className={cn('h-[25px] w-[32px]', className)}
    >
      <g fill='#527afb'>
        <path d='M17.334 10.762v9.746c0 2.012-1.025 3.027-3.066 3.027H3.066C1.026 23.535 0 22.52 0 20.508v-9.746C0 8.75 1.025 7.734 3.066 7.734h2.94v1.573h-2.92c-.977 0-1.514.527-1.514 1.543v9.57c0 1.015.537 1.543 1.514 1.543h11.152c.967 0 1.524-.527 1.524-1.543v-9.57c0-1.016-.557-1.543-1.524-1.543h-2.91V7.734h2.94c2.04 0 3.066 1.016 3.066 3.028Z' />
        <path d='M8.662 15.889c.42 0 .781-.352.781-.762V5.097l-.058-1.464.654.693 1.484 1.582a.698.698 0 0 0 .528.235c.4 0 .713-.293.713-.694 0-.205-.088-.361-.235-.508l-3.3-3.183c-.196-.196-.362-.264-.567-.264-.195 0-.361.069-.566.264L4.795 4.94a.681.681 0 0 0-.225.508c0 .4.293.694.703.694.186 0 .4-.079.538-.235l1.474-1.582.664-.693-.058 1.465v10.029c0 .41.351.762.771.762Z' />
      </g>
    </svg>
  );
}

function AddToHomeScreenIcon({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 25 25' className={cn('h-[25px] w-[20px]', className)}>
      <g fill='currentColor'>
        <path d='m23.40492,1.60784c-1.32504,-1.32504 -3.19052,-1.56912 -5.59644,-1.56912l-10.65243,0c-2.33622,0 -4.2017,0.24408 -5.5267,1.56912c-1.32504,1.34243 -1.56911,3.17306 -1.56911,5.50924l0,10.5827c0,2.40596 0.22665,4.254 1.55165,5.57902c1.34246,1.32501 3.19052,1.5691 5.59647,1.5691l10.60013,0c2.40592,0 4.2714,-0.24408 5.59644,-1.5691c1.325,-1.34245 1.55166,-3.17306 1.55166,-5.57902l0,-10.51293c0,-2.40596 -0.22666,-4.25401 -1.55166,-5.57901zm-0.38355,5.21289l0,11.24518c0,1.51681 -0.20924,2.94643 -1.02865,3.78327c-0.83683,0.83685 -2.30134,1.0635 -3.81815,1.0635l-11.33234,0c-1.51681,0 -2.96386,-0.22665 -3.80073,-1.0635c-0.83683,-0.83684 -1.04607,-2.26646 -1.04607,-3.78327l0,-11.19288c0,-1.5517 0.20924,-3.01617 1.02865,-3.85304c0.83687,-0.83683 2.31876,-1.04607 3.87042,-1.04607l11.28007,0c1.51681,0 2.98132,0.22666 3.81815,1.06353c0.81941,0.81941 1.02865,2.26645 1.02865,3.78327zm-10.53039,12.08205c0.64506,0 1.02861,-0.43586 1.02861,-1.13326l0,-4.34117l4.53294,0c0.66252,0 1.13326,-0.36613 1.13326,-0.99376c0,-0.64506 -0.43586,-1.02861 -1.13326,-1.02861l-4.53294,0l0,-4.53294c0,-0.6974 -0.38355,-1.13326 -1.02861,-1.13326c-0.62763,0 -0.99376,0.45332 -0.99376,1.13326l0,4.53294l-4.51552,0c-0.69737,0 -1.15069,0.38355 -1.15069,1.02861c0,0.62763 0.48817,0.99376 1.15069,0.99376l4.51552,0l0,4.34117c0,0.66252 0.36613,1.13326 0.99376,1.13326z' />
      </g>
    </svg>
  );
}

function BrowserMenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 -960 960 960'
      fill='currentColor'
      className={cn('h-[24px] w-[24px]', className)}
    >
      <path d='M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z' />
    </svg>
  );
}

function AddToHomeScreenIconAndroid({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 -960 960 960'
      className={cn('h-[24px] w-[24px]', className)}
    >
      <path
        fill='currentColor'
        d='M320-40q-33 0-56.5-23.5T240-120v-160h80v40h400v-480H320v40h-80v-160q0-33 23.5-56.5T320-920h400q33 0 56.5 23.5T800-840v720q0 33-23.5 56.5T720-40H320Zm0-120v40h400v-40H320ZM176-280l-56-56 224-224H200v-80h280v280h-80v-144L176-280Zm144-520h400v-40H320v40Zm0 0v-40 40Zm0 640v40-40Z'
      />
    </svg>
  );
}
