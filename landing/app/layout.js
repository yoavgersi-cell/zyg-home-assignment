import './globals.css';

export const metadata = {
  title: 'The Inside Addition — Stripes',
  description:
    'Your daily addition. Feel like yourself again. A simple daily habit that supports women through perimenopause and menopause.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6E1F26',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
