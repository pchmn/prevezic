import { Button, Flex, Modal, Radio } from '@mantine/core';
import { useInputState, useLocalStorage } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  opened: boolean;
  onClose: () => void;
  title: string;
}

export function LanguageSelector({ opened, onClose, title }: LanguageSelectorProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <LanguageSelectorContent onClose={onClose} />
    </Modal>
  );
}

function LanguageSelectorContent({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation();
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
        <Radio value="fr" label={t('account.fr')} />
        <Radio value="en" label={t('account.en')} />
      </Radio.Group>
      <Flex gap="md" justify="end" w="100%">
        <Button variant="subtle" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button onClick={() => handleSubmit(language)}>{t('common.confirm')}</Button>
      </Flex>
    </Flex>
  );
}
