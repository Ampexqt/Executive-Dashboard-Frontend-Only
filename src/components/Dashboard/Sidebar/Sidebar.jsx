import React from 'react';
import styles from './Sidebar.module.css';
import logo from '../../../assets/images/logo.png';
import { MdLogout } from 'react-icons/md';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBox}>
        <img src={logo} alt="AJH Bread & Beans Logo" className={styles.logo} />
      </div>
      <div className={styles.logoutBox}>
        <MdLogout className={styles.logoutIcon} size={29.35} />
      </div>
    </aside>
  );
};

export default Sidebar;