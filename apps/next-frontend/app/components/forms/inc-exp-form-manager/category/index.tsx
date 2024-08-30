import { ShowState } from "@financemanager/financemanager-webiste-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import styles from "@/app/components/forms/form.module.css";
import { useCreateCategoryMutation } from "@/lib/features/Category/CategoryApiSlice";

export default function CategoryForm({ showState }: { showState: ShowState }) {
  // this component can only be used when userId is available so it's always is a string.
  const [createCategory] = useCreateCategoryMutation();

  const onClick = () => showState.setShow(!showState.isShow);

  return (
    <>
      {showState.isShow ? (
        <div className={styles["form-scrim"]} onClick={onClick}></div>
      ) : (
        ""
      )}
      <div
        className={`text-black ${styles["form-container"]} ${showState.isShow ? styles["activate"] : ""}`}
      >
        <div className={styles["close-btn"]}>
          <i className="bi bi-x-circle-fill" onClick={onClick}></i>
        </div>
        <div className={styles["form-title"]}>新增自訂種類</div>
        <Formik
          initialValues={{
            type: "default",
            name: "",
          }}
          validationSchema={Yup.object().shape({
            type: Yup.string().oneOf(["income", "expense"], "請選擇類別"),
            name: Yup.string()
              .required("請輸入名稱")
              .max(16, "最多只能輸入16個字"),
          })}
          onSubmit={async (values, actions) => {
            try {
              await createCategory({ ...values }).unwrap();
              window.alert("新增成功");
              actions.resetForm();
              showState.setShow(false);
            } catch (err) {
              if ((err as FetchBaseQueryError).status === 409) {
                actions.setFieldError("name", "此名稱已存在");
              }
            }
          }}
        >
          {(props) => (
            <Form>
              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>類別 </label>
                <Field
                  as="select"
                  className={styles["form-select"]}
                  name="type"
                >
                  <option disabled value="default">
                    {" "}
                    -- 請選擇 --{" "}
                  </option>
                  <option value="income">收入</option>
                  <option value="expense">支出</option>
                </Field>
              </div>
              <ErrorMessage
                className={styles["form-ErrorMessage"]}
                name="type"
                component="div"
              />
              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>名稱</label>
                <Field
                  as="input"
                  className={styles["form-input"]}
                  name="name"
                  placeholder="類別名稱"
                />
              </div>
              <ErrorMessage
                className={styles["form-ErrorMessage"]}
                name="name"
                component="div"
              />
              <div className={styles["form-btn"]}>
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
