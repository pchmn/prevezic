import { AppShell } from '@mantine/core';
import { PropsWithChildren } from 'react';

export function SignInLayout({ children }: PropsWithChildren) {
  return (
    <AppShell padding="xl">
      {children}

      {/* <Button onClick={() => setOpen(true)}>Hello</Button>
    {currentUser && <>{currentUser.email}</>}
    <ThemeEditor opened={open} onClose={() => setOpen(false)} /> */}
    </AppShell>
  );
}
