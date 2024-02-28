import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux"
import { useFormik } from "formik";
import * as Yup from "yup";
import { setCredentials } from "../../features/Auth/AuthSlice";
import { useLoginMutation } from "../../features/Auth/AuthApiSlice";

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
            .required("請輸入電子信箱")
            .email("請確認您的輸入格式"),
            password: Yup.string()
            .required("請輸入密碼")
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
        <div className="content  h-screen bg-slate-200 flex items-center justify-center">
            <div class="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        登入帳號
                    </h1>
                    <form class="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">電子信箱</label>
                            <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" {...formik.getFieldProps('email')}/>
                            {emailError && 
                                <div class="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                    <span class="font-medium">{formik.errors.email}</span>
                                </div>
                            }
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">密碼</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" autoComplete="current-password" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...formik.getFieldProps('password')}/>
                            {passwordError && 
                                <div class="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                    <span class="font-medium">{formik.errors.password}</span>
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
                        { loginError && 
                            <div class="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                                <span class="font-medium">帳號或密碼錯誤</span>
                            </div>
                        }
                        <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">登入</button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            尚未擁有帳號? <Link to="/Register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">註冊</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}