import { Icon, IconProps } from '@prevezic/react';

export function LeftArrowIcon(props: Omit<IconProps, 'children'>) {
  return (
    <Icon {...props}>
      <g fill="none">
        <path
          d="M10.733 19.79a.75.75 0 0 0 1.034-1.086L5.516 12.75H20.25a.75.75 0 0 0 0-1.5H5.516l6.251-5.955a.75.75 0 0 0-1.034-1.086l-7.42 7.067a.995.995 0 0 0-.3.58a.754.754 0 0 0 .001.289a.995.995 0 0 0 .3.579l7.419 7.067z"
          fill="currentColor"
        ></path>
      </g>
    </Icon>
  );
}
