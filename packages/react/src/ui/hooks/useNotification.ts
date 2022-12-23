import { MantineColor } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ReactNode, useCallback } from 'react';

export function useNotification() {
  const show = useCallback(
    ({
      title,
      message,
      icon,
      color,
      autoClose = 5000,
    }: {
      title: string;
      message?: string;
      icon?: ReactNode;
      color?: MantineColor;
      autoClose?: number | boolean;
    }) => {
      showNotification({
        title,
        message,
        icon,
        color,
        styles: {
          root: {
            padding: '10px 5px 10px 22px',
          },
        },
        autoClose,
      });
    },
    []
  );

  const showSuccess = ({ title, message, icon }: { title: string; message?: string; icon?: ReactNode }) => {
    show({ title, message, icon, color: 'primary' });
  };

  const showError = useCallback(
    ({ title, message, icon }: { title: string; message?: string; icon?: ReactNode }) => {
      show({ title, message, icon, color: 'error' });
    },
    [show]
  );

  return { showSuccess, showError, show };
}
