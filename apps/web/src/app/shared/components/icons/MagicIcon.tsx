import { Icon, IconProps } from '@prevezic/react';

export function MagicIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props} viewBox="0 0 32 32">
      <path
        d="M29.414 24L12 6.586a2.048 2.048 0 0 0-2.828 0L6.586 9.172a2.002 2.002 0 0 0 0 2.828l17.413 17.414a2.002 2.002 0 0 0 2.828 0l2.587-2.586a2 2 0 0 0 0-2.828zM8 10.586L10.586 8l5 5l-2.587 2.587l-5-5z"
        fill="currentColor"
      ></path>
      <path d="M2 16l2-2l2 2l-2 2z" fill="currentColor"></path>
      <path d="M14 4l2-2l2 2l-2 2z" fill="currentColor"></path>
      <path d="M2 4l2-2l2 2l-2 2z" fill="currentColor"></path>
    </Icon>
  );
}
