import { Icon, IconProps } from '@prevezic/react';

export function ChevronRightIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      <g fill="none">
        <path
          d="M8.47 4.22a.75.75 0 0 0 0 1.06L15.19 12l-6.72 6.72a.75.75 0 1 0 1.06 1.06l7.25-7.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0z"
          fill="currentColor"
        ></path>
      </g>
    </Icon>
  );
}
