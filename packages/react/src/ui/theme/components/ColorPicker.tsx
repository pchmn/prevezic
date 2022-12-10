import styled from '@emotion/styled';
import { Group } from '@mantine/core';

import { Icon } from '../../components';

const baseColors = [
  '#D8E2FE',
  '#ACF2C8',
  '#E4DFFE',
  '#FEDDB9',
  '#FFD9DA',
  '#FFDCBB',
  '#FFE083',
  '#BBF394',
  '#CEE5FF',
  '#E7DEFF',
  '#FED7FD',
];

export function ColorPicker({ baseColor, onChange }: { baseColor: string; onChange: (color: string) => void }) {
  return (
    <>
      <Group position="center">
        {baseColors.map((color) => (
          <ColorItem key={color} color={color} onClick={() => onChange(color)} isSelected={baseColor === color} />
        ))}
      </Group>
    </>
  );
}

export const ColorDot = styled.div<{ color: string; isSelected?: boolean; size?: number }>(
  ({ color, isSelected, theme, size = 35 }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: size,
    width: size,
    backgroundColor: color,
    borderRadius: '100%',
    cursor: 'pointer',
    color:
      theme.colorScheme === 'dark'
        ? theme.fn.darken(theme.other.schemes.dark.primary, 0.6)
        : theme.other.schemes.light.primary,
    boxShadow: `0 0 0 3px ${
      isSelected
        ? theme.fn[`${theme.colorScheme}en`](theme.other.schemes[theme.colorScheme].primary, 0.5)
        : 'transparent'
    }`,
  })
);
function ColorItem({ color, onClick, isSelected }: { color: string; onClick: () => void; isSelected: boolean }) {
  return (
    <ColorDot color={color} isSelected={isSelected} onClick={onClick}>
      {isSelected && <CheckIcon />}
    </ColorDot>
  );
}

function CheckIcon() {
  return (
    <Icon size="md">
      <path
        d="M5 12l5 5L20 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </Icon>
  );
}
