import { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../Modal/Modal';
import styles from './Navbar.module.css';

const Navbar = ({ onToggleSidebar }) => {

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.navbarContent}>
            <div className={styles.navbarBrand}>
              <div className={styles.brandContent}>
                <div className={styles.brandIcon}>🏢</div>
                <h2>CompanyManager</h2>
              </div>
            </div>
            
            <div className={styles.navbarActions}>
              {/* Mobile hamburger button */}
              <button 
                onClick={onToggleSidebar} 
                className={`${styles.hamburgerButton} ${styles.mobileOnly}`}
                aria-label="Toggle sidebar"
              >
                <div className={styles.hamburgerLines}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      
    </>
  );
};

export default Navbar;