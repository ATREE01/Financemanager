"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

import { useLoginMutation } from "@/lib/features/Auth/AuthApiSlice";
import { setCredentials } from "@/lib/features/Auth/AuthSlice";
import { useAppDispatch } from "@/lib/hook";

export default function App() {
  // const user_id = useSelector(selectCurrentUserId);
  // useEffect(() => {
  //     if(user_id !== null){
  //         navigate('/', { replace : true });
  //     }
  // }, [])

  const router = useRouter();

  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const [loginError, setLoginError] = useState(false);

  return (
    <div className="content  h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            登入帳號
          </h1>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .required("請輸入電子信箱")
                .email("請確認您的輸入格式"),
              password: Yup.string().required("請輸入密碼"),
            })}
            onSubmit={async (values) => {
              setLoginError(false);
              try {
                const result = await login({
                  email: values.email,
                  password: values.password,
                }).unwrap();
                dispatch(setCredentials({ ...result }));
                router.push("/");
              } catch (error) {
                setLoginError(true);
              }
            }}
          >
            {() => (
              <Form>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    電子信箱
                  </label>
                  <Field
                    name="email"
                    type="email"
                    id="email"
                    placeholder="name@company.com"
                    autoCapitalize="true"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">
                    密碼
                  </label>
                  <Field
                    name="password"
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    autoComplete="true"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50"
                  />
                </div>
                {/* <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline ">忘記密碼?</a>
                  </div> */}
                {loginError && (
                  <div
                    className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 "
                    role="alert"
                  >
                    <span className="font-medium">帳號或密碼錯誤</span>
                  </div>
                )}
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                  >
                    登入
                  </button>
                </div>
                <p className="text-sm font-light text-gray-500 ">
                  尚未擁有帳號?{" "}
                  <Link
                    href="/auth/register"
                    className="font-medium text-primary-600 hover:underline "
                  >
                    註冊
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
