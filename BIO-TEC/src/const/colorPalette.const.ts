import { createTheme, type MantineColorsTuple } from '@mantine/core';

export const BIO_TEC_PALETTE: MantineColorsTuple = [
  '#f1f8fe',
  '#e2f1fb',
  '#c6e3f7',
  '#a5d1f0',
  '#79b9e5',
  '#4e9ed6',
  '#2f80bd',
  '#246a9f',
  '#1c527c',
  '#143b5a',
];

export const BIO_TEC_THEME = createTheme({
  colors: { blue: BIO_TEC_PALETTE },
  primaryColor: 'blue',
  primaryShade: 6,
});