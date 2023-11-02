import { APP_NAME } from "../config"
import styles from "../styles/NavbarFooter.module.css"
import dynamic from 'next/dynamic';

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <>

      <footer className={styles.footerbackground} >
        <div className={styles.footergrid}>

          {/* <div className={styles.footerbox1} >
            <div className={styles.footerheading00}>📚 {APP_NAME}</div>
            <div>Coding4U is a blog website where users can publish their articles related to programming or computer science field. It is designed to help individuals learn programming concepts, languages, and best practices. </div>


            <div className={styles.Footerlogos}>
              {socialmedia()}
            </div>


          </div> */}



          {/* <div className={styles.footerbox}>
            <div className={styles.footerheading}>Explore</div>
            <ul>
              <li> <Link href="/about-us">About Us </Link>  </li>
              <li> <Link href="/contact-us">Contact Us </Link>  </li>
              <li> <Link href="/disclaimer">Disclaimer </Link>  </li>
              <li> <Link href="/privacy-policy">Privacy Policy </Link>  </li>
            </ul>
          </div> */}



          {/* <div className={styles.footerbox}>
            <div className={styles.footerheading}>Categories</div>
            <ul>
              <li> <Link href="/categories/react">React </Link>  </li>
              <li> <Link href="/categories/wordpress">Wordpress </Link>  </li>
              <li> <Link href="/categories/django">Django </Link>  </li>
              <li> <Link href="/categories/javascript">Javascript </Link>  </li>
              <li> <Link href="/categories/seo">SEO </Link>  </li>
              <li> <Link href="/categories/python">Python </Link>  </li>
            </ul>
          </div> */}





          {/* <div className={styles.footerbox}>

            <div className={styles.footerheading}>Articles</div>
            <ul>
              <li> <Link href="/wordpress-vs-react">Wordpress vs React </Link>  </li>
              <li> <Link href="/next.js-vs-nuxt.js">Next.js vs Nuxt.js </Link>  </li>
              <li> <Link href="/how-much-js-before-react">How much JS before React ? </Link>  </li>
              <li> <Link href="/react.js-vs-next.js">React.js vs Next.js </Link>  </li>
              <li> <Link href="/what-is-nodejs">What is Node.js </Link>  </li>
              <li> <Link href="/what-is-blogging">What Is Blogging </Link>  </li>
              <li> <Link href="/wordpress-vs-blogger">Wordpress vs Blogger </Link>  </li>
            </ul>
          </div> */}


        </div>


        <div className={styles.footercopyright}>Copyright {currentYear} @ {APP_NAME}</div>

      </footer>

    </>

  )
}

export default dynamic(() => Promise.resolve(Footer), { ssr: false })