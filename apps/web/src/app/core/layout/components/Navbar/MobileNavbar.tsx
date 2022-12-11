import {
  AccountFilledIcon,
  AccountIcon,
  AlbumsFilledIcon,
  AlbumsIcon,
  HomeFilledIcon,
  HomeIcon,
} from '@app/shared/components';
import { Flex, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function MobileNavbar() {
  const navigate = useNavigate();

  return (
    <Flex
      h={72}
      justify="space-between"
      align="center"
      px={50}
      py="md"
      sx={(theme) => ({
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.other.schemes[theme.colorScheme].surface1,
      })}
    >
      {items.map((item) => (
        <Item
          key={item.label}
          {...item}
          isActive={window.location.pathname.includes(item.href)}
          onClick={() => navigate(item.href)}
        />
      ))}
    </Flex>
  );
}

function Item({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Flex
      gap="sm"
      align="center"
      justify="center"
      py="sm"
      px="md"
      sx={(theme) => ({
        position: 'relative',
        color: isActive
          ? theme.other.schemes[theme.colorScheme].primary
          : theme.other.schemes[theme.colorScheme].onBackground,
        backgroundColor: isActive ? theme.other.schemes[theme.colorScheme].surface5 : 'transparent',
        borderRadius: theme.radius.xl,
        transition: 'background-color 300ms ease-in-out, width 300ms ease-in-out, color 300ms ease-in-out',
        width: isActive ? 130 : 48,
        overflow: 'hidden',
        '& svg': {
          overflow: 'visible !important',
        },
      })}
      onClick={onClick}
    >
      {icon}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {isActive && <Text>{t(label as any) as string}</Text>}
    </Flex>
  );
}

const items = [
  {
    label: 'navbar.home',
    icon: <HomeIcon size={24} />,
    filledIcon: <HomeFilledIcon size={24} />,
    href: '/home',
  },
  {
    label: 'navbar.albums',
    icon: <AlbumsIcon size={24} />,
    filledIcon: <AlbumsFilledIcon size={24} />,
    href: '/albums',
  },
  {
    label: 'navbar.account',
    icon: <AccountIcon size={24} />,
    filledIcon: <AccountFilledIcon size={24} />,
    href: '/account',
  },
];
