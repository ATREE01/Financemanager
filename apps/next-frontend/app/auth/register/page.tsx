"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

export default function Register() {
  const router = useRouter();

  // const user_id = useSelector(selectCurrentUserId);
  // useEffect(() => {
  //     if(user_id !== null){
  //         navigate('/', { replace : true });
  //     }
  // }, [])

  const [dupEmailError, setDupEmailError] = useState(false);

  return (
    <div className="content  h-screen bg-slate-200 flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow-xl md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            註冊帳號
          </h1>
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object({
              username: Yup.string().required("請輸入使用者名稱"),
              email: Yup.string()
                .required("請輸入電子信箱")
                .email("請確認輸入格式"),
              password: Yup.string()
                .required("請輸入密碼")
                .min(8, "長度最短為8")
                .max(20, "長度最長為20")
                .matches(/^.*(?=.*[a-zA-Z]).*$/, "至少要包含一個英文字母")
                .matches(/^.*(?=.*\d).*$/, "至少要包含一個數字"),
              confirmPassword: Yup.string()
                .required("請輸入確認密碼")
                .oneOf([Yup.ref("password")], "確認密碼需與密碼相同"),
            })}
            onSubmit={async (values) => {
              setDupEmailError(false);
              try {
                const response: Response = await fetch("/api/auth/register", {
                  method: "POST",
                  body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password,
                  }),
                  headers: {
                    "Content-type": "application/json; charset=UTF-8",
                  },
                });
                if (response.ok === true) {
                  window.alert("註冊成功");
                  router.push("/login");
                } else if (response.ok === false) {
                  if (response.status === 409) {
                    setDupEmailError(true);
                  } else {
                    window.alert("發生未知錯誤");
                  }
                }
              } catch (error) {
                window.alert("發生未知錯誤");
              }
            }}
            className="space-y-4 md:space-y-6"
          >
            {() => (
              <Form>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    使用者名稱
                    <Field
                      name="username"
                      id="username"
                      autoComplete="false"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </label>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    電子信箱
                  </label>
                  <Field
                    name="email"
                    id="email"
                    autoComplete="false"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="name@company.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50"
                  />
                  {dupEmailError && (
                    <div className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50 ">
                      <span className="">Email已經註冊過 </span>
                      <Link
                        className="underline text-blue-600"
                        href="/auth/login"
                      >
                        {" "}
                        登入
                      </Link>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    密碼
                  </label>
                  <Field
                    name="password"
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    autoComplete="false"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 0"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="p-2 my-2 text-sm text-red-800 rounded-lg bg-red-50"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    確認密碼
                  </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    id="passwordConfirm"
                    placeholder="••••••••"
                    autoComplete="false"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                  >
                    註冊
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
