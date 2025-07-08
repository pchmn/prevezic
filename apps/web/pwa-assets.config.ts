import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config';

// Used to generate the PWA icons for the manifest.json
// Used by the "generate-pwa-assets" script
// https://vite-pwa-org.netlify.app/assets-generator/cli.html#png-padding
export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, 'favicon.ico']],
      resizeOptions: {
        // A padding is generated around the icon. By default, this padding is white because the background color is not specified.
        // We set a custom background color to ensure it matches the icon's color.
        background: '#0d0614',
      },
    },
    maskable: {
      sizes: [512],
      resizeOptions: {
        background: '#0d0614',
      },
    },
    apple: {
      sizes: [180],
      resizeOptions: {
        background: '#0d0614',
      },
    },
  },
  images: ['public/logo192.png'],
});
