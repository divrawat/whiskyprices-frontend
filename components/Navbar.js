import Link from 'next/link';
import { APP_NAME } from "../config"
import { isAuth } from '../actions/auth';
import dynamic from 'next/dynamic';
import styles from "../styles/NavbarFooter.module.css"


const Navbar = () => {
  function disablenavbar2() {
    let x = document.getElementById("disable")
    if (x.style.display === "block") {
      x.style.display = "none";
    }
    else { x.style.display = "block" }
  }
  
  function disablenavbar() {
    document.getElementById("disable").style.display = "none";
  }
  
  return (
    <>
      <nav className={styles.nav}>

        <div className={styles.span} onClick={disablenavbar2}>☰</div>

        <Link href="/"><div className={styles.logo}> 📚 {APP_NAME}</div></Link>

      
        <ul  id="disable" onClick={disablenavbar}>
          <li><Link href="/categories/react" >React</Link></li>
          <li><Link href="/categories/javascript">Javascript</Link></li>
          <li><Link href="/categories/django">Django</Link></li>
          <li><Link href="/categories/python">Python</Link></li>
          <li><Link href="/categories/seo">SEO</Link></li>
          <li><Link href="/categories/wordpress">Wordpress</Link></li>

          {/* If user is not authenticated then show Signin and Signout in Navbar📖 ☀️ */}
          {!isAuth() && (
            <>
              <li><Link href="/signin">Signin </Link></li>
              <li><Link href="/signup">Signup</Link></li>
            </>
          )}

          {/* If user is authenticated and is a user then show his dashboard link and Signout button */}
          {isAuth() && isAuth().role === 0 && (
            <>
              {/* <li ><Link className='userdash' href="/user">{`${isAuth().name.charAt(0).toUpperCase()}`}</Link></li> */}
              <li ><a className={styles.userdash} href="/user">{`${isAuth().name} ‒ User`}</a></li>
              {/* <li><Link href="/" onClick={sighnoutuser}>Signout</Link></li> */}
            </>
          )}


          {/* If user is authenticated and is admin then redirected him to his dashboard */}
          {isAuth() && isAuth().role === 1 && (
            <>
              <li><a className={styles.userdash} href="/admin">{`${isAuth().name} ‒ Admin`}</a> </li>
              {/* <li><Link href="/" onClick={sighnoutuser}>Signout</Link></li> */}
            </>

          )}



        </ul>
      </nav>

    </>

  )
}

// export default Navbar
export default dynamic(() => Promise.resolve(Navbar), { ssr: false })



