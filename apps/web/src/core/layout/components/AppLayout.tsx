import { AppShell } from '@mantine/core';
import { useMediaQuery } from '@prevezic/react';
import { PropsWithChildren } from 'react';

import { DesktopNavbar, MobileNavbar } from './Navbar';

export function AppLayout({ children, showNavbar = true }: PropsWithChildren<{ showNavbar?: boolean }>) {
  const showLargeNav = useMediaQuery({ largerThan: 'lg' });
  const showMediumNav = useMediaQuery({ largerThan: 'sm', smallerThan: 'lg' });
  const showMobileNav = !showLargeNav && !showMediumNav;

  return (
    <AppShell
      padding="xl"
      navbar={
        <>
          {showNavbar && showLargeNav && <DesktopNavbar size="large" />}
          {showNavbar && showMediumNav && <DesktopNavbar size="medium" />}
        </>
      }
      styles={{
        main: {
          minHeight: '100dvh',
          paddingBottom: showMobileNav ? 72 + 32 : 32,
        },
      }}
      footer={<>{showNavbar && showMobileNav && <MobileNavbar />}</>}
    >
      {children}
    </AppShell>
  );
}
