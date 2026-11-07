import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import Link from 'next/link';
import { navLinks, siteConfig } from '@/lib/site-config';
import './globals.css';

// next/font: tự host font lúc build, không gọi Google Fonts lúc runtime, không layout shift
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: siteConfig.name,
    description: siteConfig.description,
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#4338ca',
};

/** Layout chung: header + nav + footer bọc mọi route. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body>
        <a href="#main" className="skip-link">
          Bỏ qua tới nội dung chính
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <Link href="/" className="brand">
              {siteConfig.name}
            </Link>
            <nav aria-label="Điều hướng chính">
              <ul className="nav-list">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        <main id="main" className="container main">
          {children}
        </main>
        <footer className="site-footer">
          <div className="container">
            © {new Date().getFullYear()} {siteConfig.name} · Bài tập Next.js & Form Handling
          </div>
        </footer>
      </body>
    </html>
  );
}
