import { ShowState } from "@financemanager/financemanager-webiste-types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import * as Yup from "yup";

import { useCreateUserStockMutation } from "@/lib/features/stock/StockApiSlice";

export default function UserStockForm({ showState }: { showState: ShowState }) {
  const [createUserStock] = useCreateUserStockMutation();
  const onClick = () => showState.setShow(!showState.isShow);

  return (
    <>
      {showState.isShow ? (
        <div className="form-scrim" onClick={onClick}></div>
      ) : (
        ""
      )}
      <div
        className={`text-black form-container ${showState.isShow ? "activate" : ""}`}
      >
        <div className="close-btn">
          <i className="bi bi-x-circle-fill" onClick={onClick}></i>
        </div>
        <div className="form-title">新增股票</div>
        <Formik
          initialValues={{
            code: "",
            name: "",
          }}
          validationSchema={Yup.object().shape({
            code: Yup.string().required("請輸入代號"),
            name: Yup.string()
              .required("請輸入名稱")
              .max(16, "最多只能輸入16個字"),
          })}
          onSubmit={async (values, actions) => {
            try {
              await createUserStock({ ...values }).unwrap();
              window.alert("新增成功");
              actions.resetForm();
              showState.setShow(false);
            } catch (err) {
              window.alert("新增失敗");
            }
          }}
        >
          {(props) => (
            <Form>
              <div className="form-InputBar">
                <label className="form-label">股票代號</label>
                <Field
                  as="input"
                  className="form-input"
                  name="code"
                  placeholder="e.g. 0050.TW、QQQ"
                />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="code"
                component="div"
              />
              <div className="-my-2 text-center text-xl">
                <Link
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  href="https://finance.yahoo.com/markets/"
                  target="blank"
                >
                  點此前往查詢代號
                </Link>
              </div>
              <div className="form-InputBar">
                <label className="form-label">名稱</label>
                <Field
                  as="input"
                  className="form-input"
                  name="name"
                  placeholder="任意名稱"
                />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="name"
                component="div"
              />
              <div className="form-btn">
                <button
                  className="bg-slate-300 enabled:hover:bg-slate-500 border-2 border-black rounded-full disabled:opacity-25"
                  disabled={!props.dirty || !props.isValid}
                  type="submit"
                >
                  提交
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
