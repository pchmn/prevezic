import { Icon, IconProps } from '@prevezic/react';

export function PlusIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14"></path>
        <path d="M5 12h14"></path>
      </g>
    </Icon>
  );
}
