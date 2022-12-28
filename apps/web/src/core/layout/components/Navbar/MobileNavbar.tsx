import { Flex, Footer, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  AccountFilledIcon,
  AccountIcon,
  AlbumsFilledIcon,
  AlbumsIcon,
  HomeFilledIcon,
  HomeIcon,
} from 'src/shared/components';

export function MobileNavbar() {
  const navigate = useNavigate();

  return (
    <Footer
      height={80}
      sx={(theme) => ({ borderBottom: 'none', backgroundColor: theme.other.schemes[theme.colorScheme].surface1 })}
    >
      <Flex align="center" justify="center" px="md" py="sm">
        <Flex justify="space-between" align="center" gap={48}>
          {items.map((item) => (
            <Item
              key={item.label}
              {...item}
              icon={window.location.pathname.includes(item.href) ? item.filledIcon : item.icon}
              isActive={window.location.pathname.includes(item.href)}
              onClick={() => navigate(item.href)}
            />
          ))}
        </Flex>
      </Flex>
    </Footer>
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
      gap="xs"
      align="center"
      justify="center"
      direction="column"
      py="sm"
      px="sm"
      sx={(theme) => ({
        position: 'relative',
        color: isActive
          ? theme.other.schemes[theme.colorScheme].primary
          : theme.other.schemes[theme.colorScheme].onBackground,
        borderRadius: theme.radius.md,
        transition: 'background-color 300ms ease-in-out, color 300ms ease-in-out',
        '&:active': {
          backgroundColor: theme.other.schemes[theme.colorScheme].surface1,
          outline: 'none',
        },
        width: 70,
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      })}
      onClick={onClick}
    >
      {icon}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Text size="sm">{t(label as any) as string}</Text>
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
