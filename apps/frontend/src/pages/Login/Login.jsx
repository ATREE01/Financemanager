import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux"
import { useFormik } from "formik";
import * as Yup from "yup";
import { setCredentials } from "../../features/Auth/AuthSlice";
import { useLoginMutation } from "../../features/Auth/AuthApiSlice";
import './Login.css'

export default function Login(){

    const [ login ] = useLoginMutation()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues:{
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
            .required("Email must not be empty.")
            .email("Please enter a valid email."),
            password: Yup.string()
            .required("Password must not be empty.")
        }),
        onSubmit: async (values) =>{
            setLoginError(false);
            try{
                const email = values.email;
                const password = values.password;
                const userData = await login({ email, password }).unwrap();
                dispatch(setCredentials({...userData}));
                localStorage.setItem('lgdi' , 1)//Logged in
                navigate('/Dashboard', { replace : true });
            }
            catch(error){
                setLoginError(true);
            }
        }
    })

    const emailError = formik.touched.email && formik.errors.email;
    const passwordError = formik.touched.password && formik.errors.password;
    const [loginError, setLoginError] = useState(false);

    // formik.getFieldProps 取代了 value, onChange, onBlur
    return (
        <div className="content">
            <h1>This is login page</h1>
            <form onSubmit={formik.handleSubmit}>
                <div className="InputBar">
                    <label>電子信箱: </label>
                    <input placeholder="請輸入電子信箱" name="email" autoComplete="true" {...formik.getFieldProps('email')}></input> 
                    {emailError ? (
                        <p className="errorText">{formik.errors.email}</p>
                    ) : null}
                </div>
                <div className="InputBar">
                    <label>密碼: </label>
                    <input placeholder="請輸入密碼" name="password" autoComplete="true" type="password" {...formik.getFieldProps('password')} ></input>
                    {passwordError ? (
                        <p className="errorText">{formik.errors.password}</p>
                    ) : null}
                </div>
                {
                    loginError ? <p>帳號或密碼錯誤</p> : null
                }
                <div className="btn">
                    <button type="submit" disabled={!formik.dirty || !formik.isValid}>提交</button>
                </div>
                <div>
                    <Link to='/Register'>註冊帳號</Link>
                </div>
                <div>
                    <Link to='/Forget'>忘記密碼</Link> {/*TODO: make the forget password page*/}
                </div>

            </form>
        </div>
    )
}