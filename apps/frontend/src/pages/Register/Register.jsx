import {useState} from "react";
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
            .required("請輸入使用者名稱"),
            email: Yup.string()
            .required("請輸入電子信箱")
            .email("請確認輸入格式"),
            password: Yup.string()
            .required("請輸入密碼")
            .min(8, "長度最短為8")
            .matches(
                /^.*(?=.*[a-zA-Z]).*$/, "至少要包含一個英文字母"
            )
            .matches(
                /^.*(?=.*\d).*$/, "至少要包含一個數字"
            ),
            passwordConfirm: Yup.string()
            .required("請輸入確認密碼")
            .oneOf([Yup.ref('password'), null], "確認密碼需與密碼相同")
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
                        if(json.errno === 1062){
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
    const [ emailDupError, setEmailDupError ] = useState(false);
    const passwordError = formik.touched.password && formik.errors.password;
    const passwordConfirmError = formik.touched.passwordConfirm && formik.errors.passwordConfirm;


    return(
        <div className="content  h-screen bg-slate-200 flex items-center justify-center">
        <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    註冊帳號
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">使用者名稱</label>
                        <input name="username" id="username" autoComplete="false" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " {...formik.getFieldProps('username')}/>
                        {usernameError && 
                            <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                <span className="font-medium">{formik.errors.username}</span>
                            </div>
                        }
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">電子信箱</label>
                        <input type="email" name="email" id="email" autoComplete="false" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@company.com" {...formik.getFieldProps('email')}/>
                        {emailError && 
                            <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                <span className="font-medium">{formik.errors.email}</span>
                            </div>
                        }
                        {emailDupError && 
                            <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 ">
                                <span className="">Email已經註冊過   </span>
                                <Link className="underline text-blue-600" to='/Login'>   登入</Link>
                            </div>
                        }
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">密碼</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" autoComplete="false" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 0"  required="" {...formik.getFieldProps('password')}/>
                        {passwordError &&
                            <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                <span className="font-medium">{formik.errors.password}</span>
                            </div>
                        }
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">確認密碼</label>
                        <input type="password" name="passwordConfirm" id="passwordConfirm" placeholder="••••••••" autoComplete="false" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required="" {...formik.getFieldProps('passwordConfirm')}/>
                        {passwordConfirmError &&
                            <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 " role="alert">
                                <span className="font-medium">{formik.errors.passwordConfirm}</span>
                            </div>
                        }
                    </div>
                    <div className="flex items-center justify-between">
                        {/* <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                            </div>
                        </div> */}
                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</a>
                    </div>
                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">註冊</button>
                </form>
            </div>
        </div>
    </div>
    )
}