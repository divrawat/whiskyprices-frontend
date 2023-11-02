import Link from 'next/link';
import { API } from '../../config';
import styles from "../../styles/blogs.module.css"
import { format } from 'date-fns';

const Card = ({ blog }) => {

    const showBlogCategories = blog =>
        blog.categories.map((c, i) => (

            <div className={styles.tagcatdisplay} key={i}>
                <Link href={`/categories/${c.slug}`} className={styles.category}>
                    {c.name}
                </Link>
            </div>
        ))

        
    // Date Conversion
    const date = new Date(blog.date);
    const formattedDate = format(date, 'dd MMM, yyyy');

    return (

        <>
            <section className={styles.Fimage}>
                <img src={blog.photo} alt={blog.title} className={styles.images} />
            </section>

            <header><Link className={styles.headcolor} href={`/${blog.slug}`}><h2 className={styles.blogtitle}>{blog.title}</h2></Link></header>

                <section className={styles.dateauthor}>
                {formattedDate} &nbsp; by &nbsp;
                {blog.postedBy && blog.postedBy.name && blog.postedBy.username ? (
                    <Link href={`/profile/${blog.postedBy.username}`} className={styles.author}>
                        {blog.postedBy.name}
                    </Link>
                ) : (
                    <span>User</span>
                )}
            </section>

            <div className={styles.givepadding}>
                {showBlogCategories(blog)}
                <section>
                    <div className={styles.para}>{(blog.excerpt)}</div>
                   
                </section>
            </div>

        

        </>

    );
};

export default Card;