import { Icon, IconProps } from '@prevezic/react';

export function UserCheckIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
        <path d="M16 11l2 2l4-4"></path>
      </g>
    </Icon>
  );
}
