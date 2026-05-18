import Image from 'next/image';
import Link from 'next/link';
import { navLinks } from '../site-content';

type SiteHeaderProps = {
  activeHref?: string;
};

export function SiteHeader({ activeHref }: SiteHeaderProps) {
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
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link className={activeHref === link.href ? 'active' : undefined} href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="nav-cta nav-cta-link" href="/#products">
          Request a quote
        </Link>
      </nav>
    </header>
  );
}
