import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    id: 'home',
    name: 'בית',
    icon: '🏠',
    path: '/',
    color: '#4fc3f7'
  },
  {
    id: 'vocabulary',
    name: 'אוצר מילים',
    icon: '📁',
    path: '/vocabulary',
    color: '#1e90ff'
  },
  {
    id: 'practice',
    name: 'תרגול',
    icon: '🎮',
    path: '/practice',
    color: '#2ecc71'
  },
  {
    id: 'grammar',
    name: 'דקדוק',
    icon: '🧠',
    path: '/grammar',
    color: '#8e44ad'
  },
  {
    id: 'hearing',
    name: 'האזנה',
    icon: '👂',
    path: '/hearing',
    color: '#e91e63'
  }
];

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        hamburgerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router]);

  return (
    <div className={styles.layout}>
      <button
        ref={hamburgerRef}
        className={styles.hamburgerButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>

      {isMenuOpen && <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />}

      <nav
        ref={menuRef}
        className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ''}`}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={styles.menuItem}
            style={{
              background: `linear-gradient(135deg, ${item.color}, ${adjustColor(item.color, -20)})`
            }}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <main className={`${styles.mainContent} ${isMenuOpen ? styles.menuOpen : ''}`}>
        {children}
      </main>
    </div>
  );
}

// Helper function to darken a color for gradient
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
} 