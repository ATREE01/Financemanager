import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { useFormik } from "formik";
import * as Yup from "yup";
import { selectCurrentUserId, setCredentials } from "../../features/Auth/AuthSlice";
import { useLoginMutation } from "../../features/Auth/AuthApiSlice";

export default function Login(){

    const user_id = useSelector(selectCurrentUserId);
    useEffect(() => {
        if(user_id !== null){
            navigate('/', { replace : true });
        }
    }, [])

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
            <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        登入帳號
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">電子信箱</label>
                            <input type="email" name="email" id="email" placeholder="name@company.com" autoCapitalize="true" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"  {...formik.getFieldProps('email')}/>
                            {emailError && 
                                <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 " role="alert">
                                    <span className="font-medium">{formik.errors.email}</span>
                                </div>
                            }
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 ">密碼</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" autoComplete="true" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" {...formik.getFieldProps('password')}/>
                            {passwordError && 
                                <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                    <span className="font-medium">{formik.errors.password}</span>
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
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline ">Forgot password?</a>
                        </div>
                        { loginError && 
                            <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 " role="alert">
                                <span className="font-medium">帳號或密碼錯誤</span>
                            </div>
                        }
                        <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">登入</button>
                        <p className="text-sm font-light text-gray-500 ">
                            尚未擁有帳號? <Link to="/Register" className="font-medium text-primary-600 hover:underline ">註冊</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}