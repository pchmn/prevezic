import styled from '@emotion/styled';
import { Flex, Text, Title } from '@mantine/core';
import { ColorDot, ThemeEditor, useThemePreferences } from '@prevezic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageIcon, PaletteIcon } from 'src/shared/components';

import { LanguageSelector } from './LanguageSelector';
import { Profile } from './Profile';

const PreferenceItem = styled(Flex)(({ theme }) => ({
  '&:active': {
    backgroundColor: theme.other.schemes[theme.colorScheme].surface1,
    outline: 'none',
  },
  transition: 'background-color 0.2s ease',
  borderRadius: 8,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  userSelect: 'none',
}));

export function Account() {
  const { i18n, t } = useTranslation();
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);

  const { baseColor, colorScheme } = useThemePreferences();

  return (
    <Flex p="md" direction="column" justify="space-between" h="100%">
      <Flex direction="column" gap="sm">
        <Title order={4}>{t('account.preferences')}</Title>
        <Flex direction="column">
          <PreferenceItem align="center" gap="lg" px="md" py="sm" onClick={() => setLanguageSelectorOpen(true)}>
            <LanguageIcon />
            <Flex direction="column">
              <Text>{t('account.language')}</Text>
              <Text weight={300} size="sm" color="neutral">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {t(`account.${i18n.language}` as any)}
              </Text>
            </Flex>
          </PreferenceItem>
          <PreferenceItem align="center" gap="lg" px="md" py="sm" onClick={() => setThemeEditorOpen(true)}>
            <PaletteIcon />
            <Flex direction="column">
              <Text>{t('account.theme')}</Text>
              <Flex align="center" gap="sm">
                <Text weight={300} size="sm" color="neutral">
                  {t(`account.${colorScheme}Mode`)}
                </Text>
                <Text size="xs" color="neutral">
                  •
                </Text>
                <ColorDot color={baseColor} size={12} />
              </Flex>
            </Flex>
          </PreferenceItem>
        </Flex>
      </Flex>

      <Profile />

      <ThemeEditor
        title={t('themeEditor.title')}
        colorSchemeTitle={t('themeEditor.colorScheme')}
        darkLabel={t('themeEditor.dark')}
        lightLabel={t('themeEditor.light')}
        baseColorTitle={t('themeEditor.baseColor')}
        closeLabel={t('common.close')}
        opened={themeEditorOpen}
        onClose={() => setThemeEditorOpen(false)}
      />

      <LanguageSelector
        title={t('account.language')}
        opened={languageSelectorOpen}
        onClose={() => setLanguageSelectorOpen(false)}
      />
    </Flex>
  );
}
