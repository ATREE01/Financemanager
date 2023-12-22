import {useState} from "react";
import "./Register.css"
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

import { useFormik } from "formik";
import * as Yup from "yup";

export default function Register(){
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues:{
            username: "",
            email: "",
            password: "",
            passwordConfirm: ""
        },
        validationSchema: Yup.object({
            username:Yup.string()
            .required("Username is needed."),
            email: Yup.string()
            .required("Email is needed.")
            .email("Please enter a valid email."),
            password: Yup.string()
            .required("Password is needed.")
            .matches(
                /^.*(?=.{8,}).*$/, "Password must contain at least 8 characters."
            )
            .matches(
                /^.*(?=.*\d).*$/, "Password must contain at least 1 one number."
            ),
            passwordConfirm: Yup.string()
            .required("Confirm password is needed.")
            .oneOf([Yup.ref('password'), null], "Passwords must match.")
        }),
        // .matches(
        //     /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        //     "Password must contain at least 8 characters, one uppercase, one number and one special case character"
        // ),
        onSubmit: async (values) => {
            setEmailDupError(false);
            try{
                const response = await fetch('/api/auth/Register',{
                    method: 'POST',
                    body: JSON.stringify({
                        username: values.username,
                        email: values.email,
                        password: values.password
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });
                if(response.ok){
                    const json = await response.json();
                    if(json.success === 0){
                        if(json.error.errno === 1062){
                            setEmailDupError(true);
                        }
                    }
                    else {
                        window.alert('註冊成功');
                        navigate('/Login', { replace : true });
                    }
                }
            }
            catch(error){

            }
        }
    })
    
    const usernameError = formik.touched.username &&formik.errors.username;
    const emailError = formik.touched.email && formik.errors.email;
    const [emailDupError, setEmailDupError] = useState(false);
    const passwordError = formik.touched.password && formik.errors.password;
    const passwordConfirmError = formik.touched.passwordConfirm && formik.errors.passwordConfirm;


    return(
        <div className="Register">
            <h1>This is register page.</h1>
            <form onSubmit={formik.handleSubmit}>
                <div className="InputBar">
                    <label>使用者名稱:</label>
                    <input placeholder="請輸日使用者名稱" name="username" {...formik.getFieldProps('username')}></input>
                    {usernameError ? (
                        <p className="errorText">{formik.errors.username}</p>
                    ) : null}
                </div>
                <div className="InputBar">
                    <label>電子信箱: </label>
                    <input placeholder="請輸入電子信箱" name="email" {...formik.getFieldProps('email')}></input> 
                    {emailError ? (
                        <p className="errorText">{formik.errors.email}</p>
                    ) : null}
                    {emailDupError ? (
                        <div>
                            <p className="errorText">Email has been registered.</p>
                            <Link to='/Login'> 登入</Link>
                        </div>
                    ) : null}
                </div>
                <div className="InputBar">
                    <label>密碼: </label>
                    <input placeholder="請輸入密碼" name="password" type="password" {...formik.getFieldProps('password')} ></input>
                    {passwordError ? (
                        <p className="errorText">{formik.errors.password}</p>
                    ) : null}
                </div>
                <div className="InputBar">
                    <label>確認密碼: </label>
                    <input placeholder="請確認密碼" name="passwordConfirm" type="password" {...formik.getFieldProps('passwordConfirm')} ></input>
                    {passwordConfirmError ? (
                        <p className="errorText">{formik.errors.passwordConfirm}</p>
                    ) : null}
                </div>
                <div className="btn">
                    <button type="submit" disabled={!formik.dirty || !formik.isValid}>提交</button>
                </div>
            </form>
        </div>
    )
}