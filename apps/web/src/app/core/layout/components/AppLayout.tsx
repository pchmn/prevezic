import { AppShell } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { breakpoints } from '@prevezic/react';
import { PropsWithChildren } from 'react';

import { DesktopNavbar, MobileNavbar } from './Navbar';

export function AppLayout({ children, showNavbar = true }: PropsWithChildren<{ showNavbar?: boolean }>) {
  const showLargeNav = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
  const showMediumNav = useMediaQuery(`(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg}px)`);
  const showMobileNav = !showLargeNav && !showMediumNav;

  return (
    <AppShell
      padding="md"
      navbar={
        <>
          {showNavbar && showLargeNav && <DesktopNavbar size="large" />}
          {showNavbar && showMediumNav && <DesktopNavbar size="medium" />}
        </>
      }
      styles={{
        main: {
          minHeight: '100dvh',
          paddingBottom: showMobileNav ? 72 + 16 : 16,
        },
      }}
      footer={<>{showNavbar && showMobileNav && <MobileNavbar />}</>}
    >
      {children}
    </AppShell>
  );
}
