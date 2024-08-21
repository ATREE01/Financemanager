"use client";

import {
  CurrencyTypes,
  ShowState,
} from "@financemanager/financemanager-webiste-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import styles from "@/app/components/forms/form.module.css";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { useCreateBankMutation } from "@/lib/features/Bank/BankApiSlice";

export default function BankForm({ showState }: { showState: ShowState }) {
  // this component can only be used when userId is available so it's always is a string.
  const userId = useUserId() as string;

  const onClick = () => showState.setShow(!showState.isShow);

  const [createBank] = useCreateBankMutation();

  // currencyContent = userCurrency.data.map((item, index) => {
  //     currencyOption.push(item.code);
  //     return <option key={index} value={item.code}>{item.name}</option>
  // })

  return (
    <>
      {showState.isShow ? (
        <div className="form-scrim" onClick={onClick}></div>
      ) : (
        ""
      )}
      <div
        className={`text-black ${styles["form-container"]} ${showState.isShow ? styles["activate"] : ""}`}
      >
        <div className={styles["close-btn"]}>
          <i className="bi bi-x-circle-fill" onClick={onClick}></i>
        </div>
        <div className={styles["form-title"]}>新增帳戶</div>
        <Formik
          initialValues={{
            name: "",
            currency: "default",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .required("請輸入名稱")
              .max(16, "長度最長為16個字"),
            currency: Yup.string().oneOf(
              Object.values(CurrencyTypes),
              "請選擇幣別",
            ), //TODO: change to enum
          })}
          onSubmit={async (values, actions) => {
            try {
              await createBank({
                name: values.name,
                currency: values.currency,
                userId: userId,
              }).unwrap();
              showState.setShow(!showState.isShow);
              actions.resetForm();
              window.alert("新增成功");
            } catch (err) {
              if ((err as FetchBaseQueryError).status === 409)
                window.alert("已有相同的銀行名稱");
            }
          }}
        >
          {(props) => (
            <Form>
              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>名稱</label>
                <Field className={styles["form-input"]} name="name" />
              </div>
              <ErrorMessage
                className={styles["form-ErrorMessage"]}
                name="name"
                component="div"
              />
              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>幣別 </label>
                <Field
                  className={styles["form-select"]}
                  as="select"
                  name="currency"
                >
                  <option value="default" disabled>
                    -- 請選擇 --
                  </option>
                  <option value="TWD">台幣</option>
                  {/* {currencyContent} */}
                </Field>
              </div>
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
