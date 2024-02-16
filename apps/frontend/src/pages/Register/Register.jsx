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
        <div class="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    註冊帳號
                </h1>
                <form class="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                    <div>
                        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">使用者名稱</label>
                        <input name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...formik.getFieldProps('username')}/>
                        {usernameError && 
                            <div class="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                <span class="font-medium">{formik.errors.username}</span>
                            </div>
                        }
                    </div>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">電子信箱</label>
                        <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" {...formik.getFieldProps('email')}/>
                        {emailError && 
                            <div class="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                <span class="font-medium">{formik.errors.email}</span>
                            </div>
                        }
                        {emailDupError && 
                            <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
                                <span className="">Email has been registered.   </span>
                                <Link className="underline text-blue-600" to='/Login'>   登入</Link>
                            </div>
                        }
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">密碼</label>
                        <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" {...formik.getFieldProps('password')}/>
                        {passwordError &&
                            <div class="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                <span class="font-medium">{formik.errors.password}</span>
                            </div>
                        }
                    </div>
                    <div>
                        <label for="passwordConfirm" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">確認密碼</label>
                        <input type="password" name="passwordConfirm" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" {...formik.getFieldProps('passwordConfirm')}/>
                        {passwordConfirmError &&
                            <div class="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                <span class="font-medium">{formik.errors.passwordConfirm}</span>
                            </div>
                        }
                    </div>
                    <div class="flex items-center justify-between">
                        {/* <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                            </div>
                        </div> */}
                        <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                    </div>
                    <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">註冊</button>
                </form>
            </div>
        </div>
    </div>
    )
}