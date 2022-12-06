import { render } from '@testing-library/react';
import { App } from 'src/app/App';

test('render App', () => {
  expect(render(<App />)).toBeDefined();
});
