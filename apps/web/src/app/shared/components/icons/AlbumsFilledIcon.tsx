import { Icon, IconProps } from '@prevezic/react';

export function AlbumsFilledIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props} viewBox="0 0 20 20">
      <g fill="none">
        <path
          d="M3.5 2C2.67 2 2 2.67 2 3.498v12.981c0 .828.671 1.498 1.5 1.498h1c.827 0 1.499-.67 1.499-1.498V3.498C5.999 2.67 5.327 2 4.499 2h-1zm4.998 0c-.828 0-1.5.67-1.5 1.498v12.981c0 .828.672 1.498 1.5 1.498h1c.828 0 1.499-.67 1.499-1.498V3.498c0-.827-.671-1.498-1.5-1.498h-1zm7.22 4.157a1.5 1.5 0 0 0-1.87-1.106l-.745.21a1.498 1.498 0 0 0-1.06 1.742l2.003 9.799a1.5 1.5 0 0 0 1.839 1.151l.985-.25c.79-.2 1.274-.994 1.092-1.787l-2.244-9.76z"
          fill="currentColor"
        ></path>
      </g>
    </Icon>
  );
}
