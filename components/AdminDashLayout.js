import styles from "../styles/adminDashBoard.module.css"
import { signout, isAuth } from '../actions/auth';
import Router from 'next/router';
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";


const AdminDashLayout = ({ children }) => {
  function darkmode() {
    document.body.classList.toggle("darkmode");
  }
  
  function sighnoutuser() {
    signout(() => Router.replace(`/signin`))
  }
  
  function toggledashbar() {
    let x = document.getElementById("mydashbar")
    if (x.style.display === "block") {
      x.style.display = "none";
    }
    else { x.style.display = "block" }
  }
  return (
    <>
      {isAuth() && isAuth().role === 1 && (
        <>

          <div className={styles.gridcontainer}>
            <div className={styles.griditem4}><Image className={styles.Myicon0} src="/Admin.png" width={26} height={26} alt="image" /></div>
            <div className={styles.griditem1}>  {isAuth().name}'s Dashboard</div>
            <div className={styles.griditem2} onClick={sighnoutuser}><Image className={styles.Myicon0} src="/Logout.png" width={22} height={22} alt="image"/>Signout</div>
            <div className={styles.griditem3} onClick={darkmode}>
              <Image src="/WhiteMoon.png" id="moon" width={21} height={21} alt="image" />
            </div>
            <div className={styles.griditemtoggle} onClick={toggledashbar} >☰</div>
          </div>

          {/* SideDashbar */}
          <div className={styles.row}>
            <div className={styles.dashbar} id="mydashbar">
              <ul className={styles.dashbarul}>
                <a className={styles.Link} href="/"><li className={styles.list}><Image className={styles.Myicon} src="/HomeIcon.png" width={22} height={22} alt="image"/>Home</li></a>
                <Link target="_blank" className={styles.Link} href="/admin/blog"><li className={styles.list}><Image className={styles.Myicon} src="/Plus.png" width={20} height={20} alt="image"/>Add Post</li></Link>
                <Link className={styles.Link} href="/admin/category"><li className={styles.list}><Image className={styles.Myicon} src="/Categories.png" width={20} height={20} alt="image" />Categories</li></Link>
                <Link className={styles.Link} href="/admin/tag"><li className={styles.list}><Image className={styles.Myicon} src="/Tag.png" width={20} height={20} alt="image"/>Tags</li></Link>
                <Link target="_blank" className={styles.Link} href="/blogs"><li className={styles.list}><Image className={styles.Myicon} src="/books.png" width={24} height={24} alt="image"/>Blogs</li></Link>
                <a className={styles.Link} href="/admin/edit-blogs"><li className={styles.list}><Image className={styles.Myicon} src="/create.png" width={23} height={22} alt="image"/>Edit Blogs</li></a>
                
              </ul>
            </div>

            {/* Component  */}
            <div className={styles.column2}>
              {children}
            </div>
          </div>

        </>
     )}
    </>

  )
}


// export default AdminDashLayout
export default dynamic(() => Promise.resolve(AdminDashLayout), { ssr: false })