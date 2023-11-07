import Head from 'next/head';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth, signout } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { singleBlog, updateBlog } from '../../actions/blog';
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css';
import styles0 from "../../styles/editor.module.css"
import Image from 'next/image';
import slugify from 'slugify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';


function darkmode() { document.body.classList.toggle("darkmode"); }
function sighnoutuser() { signout(() => Router.replace(`/signin`)) }

const BlogUpdate = ({ router }) => {

    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]); // categories
    const [body, setBody] = useState('');

    const [values, setValues] = useState({
        title: '',
        error: '',
        success: '',
        formData: '',
        mtitle: '',
        mdesc: '',
        slug: '',
        date: '',
        photo:'',
        updatetext:'Update Post',
    });

    const { error, success, formData, title,updatetext, mtitle, mdesc, slug, date, photo } = values;
    const token = getCookie('token');

    useEffect(() => {
        setValues({ ...values, formData: new FormData() });
        initBlog();
        initCategories();
    }, [router]);



    const [message, setMessage] = useState('');
    const editBlog = e => {
        e.preventDefault();
        formData.set('body', body);
        setValues({ ...values, updatetext: 'Updating....' });
        updateBlog(formData, token, router.query.slug).then(data => {
            if (data.error) {
                setValues({ ...values });

                setMessage(data.error)

                function removemsg() {
                    setMessage("")
                }
                  setTimeout(removemsg, 2500)
            } 
            
            
            else {
                setValues({ ...values,  success: `Blog titled "${data.title}" is successfully updated` });

                let postslug = slugify(slug).toLowerCase();
                function redirect() {
                    Router.push(`/${postslug}`);
                }
                  setTimeout(redirect, 500)
                 
            }
        });
    };

    const showError = () => (<div className={styles0.error}>{message}</div>);
    const showSuccess = () => ( <div className={styles0.success}>{success}</div>);



    const initBlog = (res) => {
        if (router.query.slug) {
            singleBlog(router.query.slug).then(data => {
                if (!data) {
                    if (!isAuth()) {
                        Router.push(`/signin`);
                    } else if (isAuth().role == 1) {
                        Router.push(`/admin`);
                    }
                    else if (isAuth().role !== 1) {
                        Router.push(`/user`);
                    }

                } else {
                    const dateFromString = new Date(Date.parse(data.date));
                    setValues({ ...values, title: data.title, mtitle: data.mtitle, photo:data.photo, date: dateFromString, slug: data.slug, mdesc: data.mdesc });
                    setBody(data.body)
                    setCategoriesArray(data.categories);
                }
            });
        }
    };

    const handleChange = name => e => {
        const value = e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, error: '' });
    };

    
 

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCategories(data);
            }
        });
    };


    const setCategoriesArray = blogCategories => {
        let ca = [];
        blogCategories.map((c, i) => {
            ca.push(c._id);
        });
        setChecked(ca);
    };


    const findOutCategory = c => {
        const result = checked.indexOf(c);
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    };

    const handleToggle = c => () => {
        setValues({ ...values, error: '' });
        const clickedCategory = checked.indexOf(c);
        const all = [...checked];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }
    
        setChecked(all);
        formData.set('categories', all);
    };



    const showCategories = () => {
        return (
            categories &&
            categories.map((c, i) => (

                <li key={i} className={styles0.listitem}>
                    &nbsp;&nbsp;&nbsp;&nbsp;    <input onChange={handleToggle(c._id)} checked={findOutCategory(c._id)} type="checkbox" />
                    <label >&nbsp;&nbsp; {c.name}</label>
                </li>

            ))
        );
    };



    const handleDateChange = (date) => {
        const name = 'date';
        const value = date;
        const { formData } = values;

        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });

    };

    const handleBody = (e) => {
        setBody(e);
        formData.set('body', e);
   };

    const Admintopbar = () => {
        return (
            <div className={styles0.gridcontainer00}>
                <div className={styles0.griditem400}><Image className={styles0.Myicon000} src="/Admin.png" width={18} height={18} alt="Image" /></div>
                <div className={styles0.griditem100}>  {isAuth().name}'s Dashboard</div>
                <div className={styles0.griditem200} onClick={sighnoutuser}><Image className={styles0.Myicon000} src="/Logout.png" width={18} height={18} alt="Image" />Signout</div>
                <div className={styles0.griditem300} onClick={darkmode}>
                    <Image src="/WhiteMoon.png" id="moon" width={16} height={16} alt="Image" />
                </div>

            </div>
        )
    }

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog} style={{ background: "var(--adminBack-color)" }}>

                <div >
                    <input type="text" value={title} required className={styles0.inputs} onChange={handleChange('title')} autoFocus={true} />
                </div>


                <div className={styles0.row}>
                    <div className={styles0.column}>

                        <SunEditor
                            
                            setContents={body}
                            onChange={handleBody}

                            height="auto" setDefaultStyle="font-family:trebuchet ms; color:black;font-size:17px;padding:15px"

                            setOptions={{

                                buttonList: [
                                    ["fontSize"],
                                    [
                                        "bold",
                                        "underline",
                                        "italic",
                                        "blockquote",
                                        "subscript",
                                        "superscript",
                                    ],
                                    ["formatBlock"],
                                    ["align", "horizontalRule", "list", "table"],
                                    ["fontColor", "hiliteColor"],

                                    ["removeFormat"],

                                    ["link", "image", "video"],
                                    ["preview"],
                                    ["showBlocks", "codeView", "fullScreen"],
                                ],
                            }} />


                    </div>




                    <div className={styles0.column3} >

                        <div className={styles0.alignmsg}>
                            {showError()}
                            {showSuccess()}
                        </div>


                        <div className={styles0.albtn}>
                            <button type="submit" className={styles0.postbtn}>
                                {updatetext}
                            </button>
                        </div>

                        <div className={styles0.myinputs} id='myinputs'>
                            <div className={styles0.fieldtext}>Update Date</div>
                            <div style={{ marginBottom: "7px" }}></div>
                            <DatePicker id='date' autoComplete="off" showYearDropdown dateFormat="dd MMM, yyyy"
                                onChange={handleDateChange} selected={values.date} value={date} />

                            <div className={styles0.aligncenter}>
                                <div className={styles0.fieldtext}> Title</div>
                                <input type="text" value={mtitle} required className={styles0.inputs2} onChange={handleChange('mtitle')} />

                                <div className={styles0.fieldtext}> Meta Description</div>
                                <textarea style={{ fontSize: "13.5px", padding: "5px", marginTop: "10px", marginBottom: "20px" }} value={mdesc} onChange={handleChange('mdesc')} rows="12" cols="26"></textarea>

                                <div className={styles0.fieldtext}>Slug or Url</div>
                                <input type="text" required value={slug} className={styles0.inputs2} onChange={handleChange('slug')} />
                            </div>
                        </div>

                        <div className={styles0.fimage}>
                            <div className={styles0.mydiv}>
                                <h3>Featured Image</h3>
                                <input type="text" required value={photo} className={styles0.inputs2} onChange={handleChange('photo')} />
                            </div>
                        </div>



                        <div className={styles0.cat}>
                            <div className={styles0.heading1}>Categories</div>
                            <br />

                            <ul> {showCategories()}</ul>
                            <br /><br />
                           

                        </div>
                    </div>

                </div>
            </form>
        );
    };

    const head = () => (
        <Head>
            <title>Update This Article</title>
        </Head>
    );


    return (
        <>

            {head()}
            {isAuth() && (
                <>
                    {Admintopbar()}

                    {updateBlogForm()}

                </>
            )}
        </>
    );
};

export default withRouter(BlogUpdate);