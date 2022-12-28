import styled from '@emotion/styled';
import { Flex, Image, Navbar as MantineNavbar, Space, Text, Title } from '@mantine/core';
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

export function DesktopNavbar({ size }: { size: 'large' | 'medium' }) {
  return (
    <MantineNavbar width={{ base: size === 'large' ? 300 : 72 }} pl="md" pr="md" pt="xl">
      <Flex gap="md" align="center">
        <Image src="favicon.svg" height={32} width={32} pl="xs" />
        {size === 'large' && <Title order={4}>Prevezic</Title>}
      </Flex>

      <Space h={40} />
      <NavbarItems size={size} />
    </MantineNavbar>
  );
}

const items = [
  {
    label: 'navbar.home',
    icon: <HomeIcon size="lg" />,
    filledIcon: <HomeFilledIcon size="lg" />,
    href: '/home',
  },
  {
    label: 'navbar.albums',
    icon: <AlbumsIcon size="lg" />,
    filledIcon: <AlbumsFilledIcon size="lg" />,
    href: '/albums',
  },
  {
    label: 'navbar.account',
    icon: <AccountIcon size="lg" />,
    filledIcon: <AccountFilledIcon size="lg" />,
    href: '/account',
  },
];
function NavbarItems({ size }: { size: 'large' | 'medium' }) {
  const navigate = useNavigate();

  return (
    <Flex direction="column" gap="sm">
      {items.map((item) => (
        <Item
          key={item.label}
          icon={window.location.pathname.includes(item.href) ? item.filledIcon : item.icon}
          label={size == 'large' ? item.label : ''}
          isActive={window.location.pathname.includes(item.href)}
          onClick={() => navigate(item.href)}
        />
      ))}
    </Flex>
  );
}

const NavLink = styled(Flex, { shouldForwardProp: (propName: string) => propName !== 'isActive' })<{
  isActive?: boolean;
}>(({ theme, isActive }) => ({
  padding: theme.spacing.sm,
  borderRadius: theme.radius.md,
  transition: 'background-color 100ms ease',
  '&:hover': {
    backgroundColor: theme.other.schemes[theme.colorScheme].surface2,
  },
  cursor: 'pointer',
  fontWeight: isActive ? 600 : 400,
  backgroundColor: isActive ? theme.other.schemes[theme.colorScheme].surface2 : 'transparent',
  color: isActive ? theme.other.schemes[theme.colorScheme].primary : 'inherit',
}));
function Item({
  label,
  icon,
  onClick,
  isActive,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  isActive: boolean;
}) {
  const { t } = useTranslation();
  return (
    <NavLink gap="md" isActive={isActive} onClick={onClick}>
      {icon}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {label && <Text>{t(label as any) as string}</Text>}
    </NavLink>
  );
}
