import { APP_NAME } from "../config"
import styles from "../styles/NavbarFooter.module.css"
import dynamic from 'next/dynamic';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <footer className={styles.footerbackground} > 
        <div className={styles.footercopyright}>Copyright {currentYear} @ {APP_NAME}</div>
      </footer>
    </>
  )
}

export default dynamic(() => Promise.resolve(Footer), { ssr: false })