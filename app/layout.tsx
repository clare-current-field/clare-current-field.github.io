import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Current Field | Residential Interiors',
  description: 'Thoughtful residential interior design in the San Francisco Bay Area.',
  icons: {
    icon: [{ url: '/favicon.ico?v=2', sizes: '32x32' }, { url: '/current-field-icon.png?v=2', type: 'image/png', sizes: '32x32' }],
    shortcut: '/favicon.ico?v=2',
  },
  // Keep previews out of search results. This is not access protection.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="site-footer">
          <div className="site-footer-brand">
            <a className="wordmark" href="/">Current Field</a>
            <p>Bay Area residential design</p>
          </div>
          <div className="site-footer-meta">
            <div className="site-footer-links">
              <a href="mailto:hello@currentfield.com" aria-label="Email Current Field at hello@currentfield.com">Email</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
            <p>© 2026 Current Field</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
