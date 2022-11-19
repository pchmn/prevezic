import { ButtonStylesParams } from '@mantine/core';
import { MaterialColors, ThemeComponent } from '../types';
import { getOnColor } from '../utils';

const Button: ThemeComponent = {
  styles: (theme, params: ButtonStylesParams) => ({
    root: {
      color:
        params.variant === 'filled' ? getOnColor(params.color as MaterialColors, theme) : theme.colors[params.color][7]
    }
    // filled: {
    //   color: 'pink'
    // },
    // outline: {
    //   color: getColor(params.color as MaterialColors, theme),
    //   borderColor: theme.other.schemes[theme.colorScheme].outline
    // }
  })
};

export default Button;
