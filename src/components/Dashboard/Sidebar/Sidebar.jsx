import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import logo from '../../../assets/images/logo.png';
import { MdLogout } from 'react-icons/md';
import LogoutModal from '../../Modals/Logout/LogoutModal';

const Sidebar = ({ open, onClose }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleCancel = () => setShowLogoutModal(false);
  const handleLogout = () => {
    setShowLogoutModal(false);
    // TODO: Add your logout logic here (e.g., clear auth, redirect)
  };

  // Overlay and close button for mobile
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={open ? styles.overlay + ' ' + styles.overlayVisible : styles.overlay}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={
          styles.sidebar +
          ' ' +
          (open ? styles.sidebarOpen : '')
        }
      >
        {/* Close button for mobile */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close sidebar menu"
          type="button"
        >
          &times;
        </button>
        <div className={styles.logoBox}>
          <img src={logo} alt="AJH Bread & Beans Logo" className={styles.logo} />
        </div>
        <div className={styles.logoutBox} onClick={handleLogoutClick}>
          <MdLogout className={styles.logoutIcon} size={29.35} />
        </div>
        <LogoutModal open={showLogoutModal} onCancel={handleCancel} onLogout={handleLogout} />
      </aside>
    </>
  );
};

export default Sidebar;