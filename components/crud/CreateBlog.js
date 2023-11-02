import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { getCookie, signout, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { createBlog } from '../../actions/blog';
import styles0 from "../../styles/editor.module.css"
import Image from 'next/image';
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import 'suneditor/dist/css/suneditor.min.css';
import slugify from 'slugify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Head from 'next/head';
function darkmode() { document.body.classList.toggle("darkmode"); }
function sighnoutuser() { signout(() => Router.replace(`/signin`)) }


const CreateBlog = ({ router }) => {
    const blogFromLS = () => {
        if (typeof window === 'undefined') {
            return false;
        }

        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'));
        } else {
            return "";
        }
    };
    const [body, setBody] = useState(blogFromLS());
    const [checked, setChecked] = useState([]); // categories
    const [categories, setCategories] = useState([]);
    // const [selectedDate, setSelectedDate] = useState(null);



    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));
        }
    };


    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        mtitle: '',
        mdesc: '',
        slug: '',
        photo: '',
        publishtext:'Publish Post',
    });

    const { error, success, formData,publishtext, title, mtitle, mdesc, slug, photo } = values;
    const token = getCookie('token');


    const publishBlog = e => {
        e.preventDefault();
        setValues({ ...values, publishtext: 'Publishing...' });
        createBlog(formData, token).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, title: '', mtitle: '', mdesc: '', slug: '', photo: '', error: '', success: `A new blog titled "${data.title}" is created` });

                let postslug = slugify(slug).toLowerCase();
                function redirect() {
                    Router.replace(`/${postslug}`);
                }
                setTimeout(redirect, 200)


                setBody('');
                setCategories([]);
            }
        });
    };


    const handleChange = name => e => {
        const value = e.target.value;
        formData.set(name, value);
        setValues({ ...values, [name]: value, error: '' });
    };


    useEffect(() => {
        setValues({ ...values, formData: new FormData() });
        initCategories();

    }, [router]);


    const initCategories = () => {

        getCategories().then(data => {
            // console.log(data)
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCategories(data);
            }
        });
    };







    const handleToggle = c => () => {
        setValues({ ...values, error: '' });
        // return the first index or -1
        const clickedCategory = checked.indexOf(c);
        const all = [...checked];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }
        console.log(all);
        setChecked(all);
        formData.set('categories', all);
    };



    const showError = () => (
        <div className={styles0.error} style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className={styles0.success} style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    );





    const showCategories = () => {
        return (
            categories &&
            categories.map((c, i) => (
                <li key={i} className={styles0.listitem}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input onChange={handleToggle(c._id)} type="checkbox" style={{ cursor: "pointer" }} />
                    <label >&nbsp;&nbsp;{c.name}</label>
                </li>
            ))
        );
    };


    const handleDateChange = (date) => {
        const name = 'date';
        const value = date;
        const { formData } = values;

        formData.set(name, value);
        console.log(value);
        // setValues({...values,[name]: value,formData: formData,error: '',});
        setValues({ ...values, [name]: value, formData, error: '' });

    };


    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog} style={{background:"var(--adminBack-color)"}}>

                <div>
                    <input placeholder='Title Goes Here' type="text" value={title} className={styles0.inputs} onChange={handleChange('title')} autoFocus={true} />
                </div>


                <div className={styles0.row}>
                    <div className={styles0.column} >

                        <SunEditor
                            setContents={body} placeholder="Start typing paragraph here .............."
                            onChange={handleBody} height="auto" setDefaultStyle="font-family:trebuchet ms; color:black;font-size:17px;padding:15px"
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




                    <div className={styles0.column2} >

                        <div className={styles0.alignmsg}>
                            {showError()}
                            {showSuccess()}
                        </div>


                        <div className={styles0.albtn}>
                            <button type="submit" className={styles0.postbtn}>
                                {publishtext}
                            </button>
                        </div>


                        <div className={styles0.myinputs} id='myinputs'>
                            <div className={styles0.fieldtext}> Published Date</div>
                            <div style={{ marginBottom: "7px" }}>

                            </div>
                            <DatePicker id='date' autoComplete="off" onChange={handleDateChange}
                                selected={values.date} minDate={new Date()} showYearDropdown dateFormat="dd MMM, yyyy"

                            />


                            <div className={styles0.fieldtext}> Title</div>
                            <input placeholder='Meta Title' type="text" value={mtitle} className={styles0.inputs2} onChange={handleChange('mtitle')} />

                            <div className={styles0.fieldtext}> Meta Description</div>
                            <textarea style={{ fontSize: "13.5px", padding: "5px", marginTop: "10px", marginBottom: "15px" }} placeholder='Meta Description' value={mdesc} onChange={handleChange('mdesc')} rows="12" cols="26"></textarea>

                            <div className={styles0.fieldtext}>Slug or Url</div>
                            <input placeholder='slug or url' type="text" value={slug} className={styles0.inputs2} onChange={handleChange('slug')} />
                        </div>



                        <div className={styles0.fimage}>
                            <div className={styles0.mydiv}>
                                <h3>Featured Image</h3>
                                <input placeholder='Image Link' type="text" value={photo} className={styles0.inputs2} onChange={handleChange('photo')} />
                            </div>
                        </div>



                        <div className={styles0.cat}>
                            <div className={styles0.heading1}>Categories</div>
                            <div style={{ marginTop: "10px" }}></div>
                            {showCategories()}
                            <div style={{ marginTop: "30px" }}></div>
                           
                        </div>

                    </div>

                </div>
            </form>
        );
    };



    const head = () => (
        <Head>
            <title>Create an Article</title>
        </Head>
    );


    const Admintopbar = () => {
        return (
            <>
                {isAuth() && (
                    <div className={styles0.gridcontainer00}>
                        <div className={styles0.griditem400}><Image className={styles0.Myicon000} src="/Admin.png" width={18} height={18} alt="Image" /></div>
                        <div className={styles0.griditem100}>  {isAuth().name}'s Dashboard</div>
                        <div className={styles0.griditem200} onClick={sighnoutuser}><Image className={styles0.Myicon000} src="/Logout.png" width={18} height={18} alt="Image" />Signout</div>
                        <div className={styles0.griditem300} onClick={darkmode}>
                            <Image src="/WhiteMoon.png" id="moon" width={16} height={16} alt="Image" />
                        </div>

                    </div>
                )}
            </>
        )
    }


    return (
        <>
            {head()}

            {Admintopbar()}
            {createBlogForm()}
        </>
    );
};

export default CreateBlog