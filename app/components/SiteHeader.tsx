'use client';

import Image from 'next/image';
import Link from 'next/link';
import { navLinks } from '../site-content';
import { useQuote } from '../context/QuoteContext';

type SiteHeaderProps = {
  activeHref?: string;
};

export function SiteHeader({ activeHref }: SiteHeaderProps) {
  const { quoteItems, openDrawer } = useQuote();
  const totalCount = quoteItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label="Hands of Heritage home">
        <Image src="/logohoh.png" alt="Hands of Heritage logo" width={58} height={52} priority className="brand-logo" />
        <div>
          <span>Hands of</span>
          <strong>Heritage</strong>
        </div>
      </Link>
      <nav className="header-nav">
        <ul>
            {navLinks.map((link) => {
              const isCorporate = link.href === '/corporate-gifts';
              const isWedding = link.href === '/wedding-favours';
              const linkClasses = [
                activeHref === link.href ? 'active' : '',
                isWedding ? 'nav-primary' : '',
                isCorporate ? 'nav-secondary' : '',
              ].filter(Boolean).join(' ');

              return (
                <li key={link.href}>
                  <Link className={linkClasses || undefined} href={link.href}>
                    {link.label}
                  </Link>
                </li>
              );
            })}
        </ul>
        <button type="button" className="nav-cta" onClick={openDrawer}>
          Request a quote
          <span className={`quote-count ${totalCount > 0 ? 'visible' : ''}`}>{totalCount}</span>
        </button>
      </nav>
    </header>
  );
}
