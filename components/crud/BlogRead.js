// import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getCookie } from '../../actions/auth';
import { list, removeBlog } from '../../actions/blog';
import dynamic from 'next/dynamic';
const AdminDashLayout = dynamic(() => import('../AdminDashLayout'), { ssr: false });
import styles0 from "../../styles/editblogs.module.css"

const BlogRead = () => {
  const head = () => (
    <Head>
      <title>Edit Blogs</title>
    </Head>
  );
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState('');
  const [ModalOpen, setModalOpen] = useState(false);
  const [currentBlogSlug, setCurrentBlogSlug] = useState("");

  const showModal = (slug) => {
    setModalOpen(true);
    setCurrentBlogSlug(slug);
    document.body.style.overflow = 'hidden';
  };

  const hideModel = () => {
    setModalOpen(false);
    setCurrentBlogSlug("");
    document.body.style.overflow = 'auto';

  };


  const loadBlogs = () => {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };
  
  
  useEffect(() => {
    loadBlogs();
  }, []);

  const token = getCookie('token');
  const deleteBlog = slug => {
    removeBlog(slug, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage("BlogPost Deleted Successfully");
        loadBlogs();
        setTimeout(() => {
          setMessage("");
        }, 2500);
      }
    });
  };


  const handleConfirmDelete = () => {
    deleteBlog(currentBlogSlug);
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };



  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const prevPage = () => {
    goToPage(Math.max(currentPage - 1, 0));
  };

  const nextPage = () => {
    goToPage(Math.min(currentPage + 1, pageCount - 1));
  };
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(blogs.length / PAGE_SIZE);


  const showAllBlogs = () => {
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = Math.min((currentPage + 1) * PAGE_SIZE, blogs.length);

    return blogs.slice(startIndex, endIndex).map((blog, i) => {
      return (
        <div key={i} className={styles0.blog}>
          <div className={styles0.heading}>{blog.title}</div>
          <section className={styles0.date}>
            {blog.date}
            {blog.postedBy && blog.postedBy.name && blog.postedBy.username ? (
              <> - {blog.postedBy.name} </>
            ) : (
              <span> - User</span>
            )}
          </section>



          {/* <div onClick={() => deleteConfirm(blog.slug)} onDelete={handleDelete} className={styles0.deletebtn}> */}
          <div onClick={() => showModal(blog.slug)} className={styles0.deletebtn}>Delete</div>
          <a target="_blank" href={`/admin/${blog.slug}`} className={styles0.updatebtn}>Edit</a>




          {ModalOpen && (
            <div className="modal">
              <div className="modalContent">
              <div>Are you sure you want to delete this post ?</div>
              <br />
              <button className={styles0.deletebtn00} onClick={handleConfirmDelete}> DELETE</button>
              <button className={styles0.deletebtn00} onClick={hideModel}>CANCEL</button>
              </div>
            </div>
          )}


        </div>
      );
    });
  };



  return (

    <AdminDashLayout >

      {head()}
      <div className={styles0.container}>

        <div className={styles0.headingDash}>{blogs.length} Posts</div>



        {/* Pagination */}
        {pageCount > 1 && (
          <div className={styles0.pagination}>
            <button className={currentPage === 0 ? styles0.disabled : ""} disabled={currentPage === 0} onClick={prevPage}>
              Prev
            </button>
            {[...Array(pageCount)].map((_, i) => {
              const isFirstPage = i === 0;
              const isLastPage = i === pageCount - 1;
              const isCurrentPage = i === currentPage;
              const isNearCurrentPage = Math.abs(i - currentPage) <= 3;
              const shouldRenderPageNumber = isFirstPage || isLastPage || isCurrentPage || isNearCurrentPage;
              if (shouldRenderPageNumber) {
                return (
                  <button
                    key={i}
                    className={isCurrentPage ? styles0.current : ""}
                    disabled={isCurrentPage}
                    onClick={() => goToPage(i)}
                  >
                    {i + 1}
                  </button>
                );
              } else if ((i === currentPage - 4 || i === currentPage + 4) && !isFirstPage && !isLastPage) {
                // Add dots for gaps between current page and adjacent pages, except for first and last pages
                return (
                  <span key={i} className={styles0.dots}>
                    ...
                  </span>
                );
              } else {
                return null;
              }
            })}


            <button className={currentPage === pageCount - 1 ? styles0.disabled : ""} disabled={currentPage === pageCount - 1} onClick={nextPage}>
              Next
            </button>
          </div>
        )}
        {/* Pagination */}

        {message && <div id='msg' className={styles0.message}>{message}</div>}


        {showAllBlogs()}

        </div>
  
    </AdminDashLayout>
  );


}

export default BlogRead;
