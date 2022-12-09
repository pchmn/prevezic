import { Icon, IconProps } from '@prevezic/react';

export function AccountFilledIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props} viewBox="0 0 32 32">
      <path d="M6 30h20v-5a7.008 7.008 0 0 0-7-7h-6a7.008 7.008 0 0 0-7 7z" fill="currentColor"></path>
      <path d="M9 9a7 7 0 1 0 7-7a7 7 0 0 0-7 7z" fill="currentColor"></path>
    </Icon>
  );
}
