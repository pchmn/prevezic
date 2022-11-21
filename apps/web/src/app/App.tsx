import { AppShell, Button, Header, Navbar } from '@mantine/core';
import { ThemeEditor } from '@prevezic/react/src/ui/theme';
import { useState } from 'react';
import './App.css';

function App() {
  const [open, setOpen] = useState(false);
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="sx">
          {/* Navbar content */}
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          {/* Header content */}
        </Header>
      }
    >
      <Button onClick={() => setOpen(true)}>Hello</Button>
      <ThemeEditor opened={open} onClose={() => setOpen(false)} />
    </AppShell>
  );
}

export default App;
