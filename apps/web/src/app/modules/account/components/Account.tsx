import { LanguageIcon, PaletteIcon } from '@app/shared/components';
import styled from '@emotion/styled';
import { Button, Flex, Modal, Radio, Text, Title } from '@mantine/core';
import { useInputState, useLocalStorage } from '@mantine/hooks';
import { ColorDot, ThemeEditor, useThemePreferences } from '@prevezic/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PreferenceItem = styled(Flex)(({ theme }) => ({
  '&:active': {
    backgroundColor: theme.other.schemes[theme.colorScheme].surface1,
    outline: 'none',
  },
  transition: 'background-color 0.2s ease',
  borderRadius: 8,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
}));

export function Account() {
  const { i18n } = useTranslation();
  const [themeEditorOpen, setThemeEditorOpen] = useState(false);
  const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);

  const { baseColor, colorScheme } = useThemePreferences();

  return (
    <Flex p="md" direction="column" gap="sm">
      <Title order={2}>{i18n.t('account.title')}</Title>
      <Title order={4}>{i18n.t('account.preferences')}</Title>
      <PreferenceItem align="center" gap="lg" px="md" py="sm" onClick={() => setLanguageSelectorOpen(true)}>
        <LanguageIcon />
        <Flex direction="column" gap={2}>
          <Text>{i18n.t('account.language')}</Text>
          <Text weight={300} size="sm" color="neutral">
            {i18n.t(`account.${i18n.language}`)}
          </Text>
        </Flex>
      </PreferenceItem>
      <PreferenceItem align="center" gap="lg" px="md" py="sm" onClick={() => setThemeEditorOpen(true)}>
        <PaletteIcon />
        <Flex direction="column" gap={2}>
          <Text>{i18n.t('account.theme')}</Text>
          <Flex align="center" gap="sm">
            <Text weight={300} size="sm" color="neutral">
              {i18n.t(`account.${colorScheme}Mode`)}
            </Text>
            <Text size="xs" color="neutral">
              •
            </Text>
            <ColorDot color={baseColor} size={12} />
          </Flex>
        </Flex>
      </PreferenceItem>

      <ThemeEditor opened={themeEditorOpen} onClose={() => setThemeEditorOpen(false)} />

      <Modal
        opened={languageSelectorOpen}
        onClose={() => setLanguageSelectorOpen(false)}
        title={i18n.t('account.language')}
      >
        <LanguageSelector onClose={() => setLanguageSelectorOpen(false)} />
      </Modal>
    </Flex>
  );
}

function LanguageSelector({ onClose }: { onClose: () => void }) {
  const { i18n } = useTranslation();
  const [, setLanguageStorage] = useLocalStorage({ key: 'language', defaultValue: 'en' });
  const [language, setLanguage] = useInputState(i18n.language);

  const handleSubmit = (value: string) => {
    setLanguageStorage(value);
    i18n.changeLanguage(value);
    onClose();
  };

  return (
    <Flex direction="column" gap="xl" pt="md">
      <Radio.Group value={language} onChange={setLanguage} name="language" orientation="vertical">
        <Radio value="fr" label={i18n.t('account.fr')} />
        <Radio value="en" label={i18n.t('account.en')} />
      </Radio.Group>
      <Flex gap="md" justify="end" w="100%">
        <Button variant="subtle" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={() => handleSubmit(language)}>Confirmer</Button>
      </Flex>
    </Flex>
  );
}
