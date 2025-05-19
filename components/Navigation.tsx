import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { FaBars, FaArrowRight, FaChartBar, FaUser, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import styles from '@/styles/Navigation.module.css';

interface NavigationProps {
  onLogout?: () => void;
}

export default function Navigation({ onLogout }: NavigationProps) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <div className={styles.navigation}>
      {isHomePage ? (
        <>
          <button
            ref={hamburgerRef}
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <FaBars />
          </button>
          {isMenuOpen && (
            <div className={styles.overlay}>
              <div ref={menuRef} className={styles.menu}>
                <button onClick={() => handleNavigation('/statistics')}>
                 פרופיל - בקרוב      
                </button>
                <button onClick={() => handleNavigation('/profile')}>
                 אודות - בקרוב
                </button>
                <button onClick={() => handleNavigation('/about')}>
                  התנתקות - בקרוב
                </button>
                {onLogout && (
                  <button onClick={onLogout} className={styles.logoutButton}>
                    התנתק
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={() => router.back()}
          className={styles.backButton}
          aria-label="Go back"
        >
          <FaArrowRight />
        </button>
      )}
    </div>
  );
} 