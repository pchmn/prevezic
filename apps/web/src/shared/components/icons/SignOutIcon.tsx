import { Icon, IconProps } from '@prevezic/react';

export function SignOutIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"></path>
        <path d="M7 12h14l-3-3m0 6l3-3"></path>
      </g>
    </Icon>
  );
}
