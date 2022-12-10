import { AppShell, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { PropsWithChildren } from 'react';

import { DesktopNavbar, MobileNavbar } from './Navbar';

export function AppLayout({ children, showNavbar = true }: PropsWithChildren<{ showNavbar?: boolean }>) {
  const theme = useMantineTheme();
  const showLargeNav = useMediaQuery(`(min-width: ${theme.breakpoints.lg}px)`);
  const showMediumNav = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm}px) and (max-width: ${theme.breakpoints.lg}px)`
  );
  const showMobileNav = !showLargeNav && !showMediumNav;

  console.log('showLargeNav', showLargeNav);

  return (
    <AppShell
      padding="md"
      navbar={
        <>
          {showNavbar && showLargeNav && <DesktopNavbar size="large" />}
          {showNavbar && showMediumNav && <DesktopNavbar size="medium" />}
        </>
      }
    >
      {children}
      {showMobileNav && <MobileNavbar />}
    </AppShell>
  );
}
