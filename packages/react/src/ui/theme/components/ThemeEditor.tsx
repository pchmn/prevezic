import { Box, Button, Center, Flex, Modal, SegmentedControl, Title } from '@mantine/core';
import { Icon } from '../../components';
import { useThemePreferences } from '../../provider';
import { ColorPicker } from './ColorPicker';

interface ThemeEditorProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  colorSchemeTitle?: string;
  baseColorTitle?: string;
  darkLabel?: string;
  lightLabel?: string;
  closeLabel?: string;
}

export function ThemeEditor({ opened, onClose, title = 'Theme editor', ...otherProps }: ThemeEditorProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <ThemeEditorContent onClose={onClose} {...otherProps} />
    </Modal>
  );
}

function ThemeEditorContent({
  onClose,
  colorSchemeTitle = 'Color scheme',
  baseColorTitle = 'Base color',
  darkLabel = 'Dark',
  lightLabel = 'Light',
  closeLabel = 'Close'
}: Omit<ThemeEditorProps, 'opened' | 'title'>) {
  const { colorScheme, baseColor, changeBaseColor, toggleColorScheme } = useThemePreferences();

  return (
    <Flex direction="column" gap="xl">
      <Flex direction="column" gap="sm" justify="center" align="center">
        <Title order={6}>{colorSchemeTitle}</Title>
        <SegmentedControl
          value={colorScheme}
          onChange={() => toggleColorScheme()}
          data={[
            {
              value: 'dark',
              label: (
                <Center>
                  <MoonIcon />
                  <Box ml={10}>{darkLabel}</Box>
                </Center>
              )
            },
            {
              value: 'light',
              label: (
                <Center>
                  <SunIcon />
                  <Box ml={10}>{lightLabel}</Box>
                </Center>
              )
            }
          ]}
        />
      </Flex>

      <Flex direction="column" gap="sm" justify="center" align="center">
        <Title order={6}>{baseColorTitle}</Title>
        <ColorPicker baseColor={baseColor} onChange={changeBaseColor} />
      </Flex>

      <Button sx={{ marginTop: 20 }} onClick={() => onClose()}>
        {closeLabel}
      </Button>
    </Flex>
  );
}

function MoonIcon() {
  return (
    <Icon>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"></path>
        <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2"></path>
        <path d="M19 11h2m-1-1v2"></path>
      </g>
    </Icon>
  );
}

function SunIcon() {
  return (
    <Icon>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"></path>
      </g>
    </Icon>
  );
}
