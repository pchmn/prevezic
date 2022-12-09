import {
  AccountFilledIcon,
  AccountIcon,
  AlbumsFilledIcon,
  AlbumsIcon,
  HomeFilledIcon,
  HomeIcon,
} from '@app/shared/components';
import { Flex, Text } from '@mantine/core';
import i18next from 'i18next';
import { ReactNode } from 'react';
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
      {/* <SegmentedControl
        radius="lg"
        value={window.location.pathname}
        onChange={(value) => navigate(value)}
        data={items.map((item) => ({
          value: item.href,
          label: (
            <Flex gap="sm" align="center" justify="center">
              {item.icon}
              {window.location.pathname.includes(item.href) && <Text>{item.label}</Text>}
            </Flex>
          ),
        }))}
        sx={{
          backgroundColor: 'transparent',
          width: '100%',
        }}
      />*/}
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
  return (
    <Flex
      gap="sm"
      align="center"
      py="sm"
      px="md"
      sx={(theme) => ({
        color: isActive
          ? theme.other.schemes[theme.colorScheme].primary
          : theme.other.schemes[theme.colorScheme].onBackground,
        backgroundColor: isActive ? theme.other.schemes[theme.colorScheme].surface5 : 'transparent',
        borderRadius: theme.radius.xl,
        transition: 'background-color 300ms ease-in-out, max-width 300ms ease-in-out',
        maxWidth: isActive ? 200 : 48,
        overflow: 'hidden',
        '& svg': {
          overflow: 'visible !important',
        },
      })}
      onClick={onClick}
    >
      {icon}
      <Text>{label}</Text>
    </Flex>
  );
}

const items = [
  {
    label: i18next.t('navbar.home'),
    icon: <HomeIcon size={24} />,
    filledIcon: <HomeFilledIcon size={24} />,
    href: '/home',
  },
  {
    label: i18next.t('navbar.home'),
    icon: <AlbumsIcon size={24} />,
    filledIcon: <AlbumsFilledIcon size={24} />,
    href: '/albums',
  },
  {
    label: i18next.t('navbar.home'),
    icon: <AccountIcon size={24} />,
    filledIcon: <AccountFilledIcon size={24} />,
    href: '/account',
  },
];
