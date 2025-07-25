"use client";

import { ShowState } from "@financemanager/financemanager-website-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import LoadingPage from "@/app/components/loading-page";
import { useCreateBankMutation } from "@/lib/features/Bank/BankApiSlice";
import { useGetUserCurrenciesQuery } from "@/lib/features/Currency/CurrencyApiSlice";

export default function BankForm({ showState }: { showState: ShowState }) {
  const onClick = () => showState.setShow(!showState.isShow);
  const [createBank] = useCreateBankMutation();

  const { data: userCurrencies, isLoading: userCurrenciesIsLoading } =
    useGetUserCurrenciesQuery();

  if (!userCurrencies || userCurrenciesIsLoading) return <LoadingPage />;
  const currencyIds = userCurrencies.map((userCurrency) =>
    userCurrency.currency.id.toString(),
  );

  const userCurrencyNode = userCurrencies.map((userCurrency) => (
    <option key={userCurrency.currency.id} value={userCurrency.currency.id}>
      {userCurrency.currency.name}
    </option>
  ));
  //TODO: make the user can reorder the bank.
  return (
    <>
      {showState.isShow && <div className="form-scrim" onClick={onClick}></div>}
      <div
        className={`text-black form-container ${showState.isShow ? "activate" : ""}`}
      >
        <div className="close-btn">
          <i className="bi bi-x-circle-fill" onClick={onClick}></i>
        </div>
        <div className="form-title">新增帳戶</div>
        <Formik
          initialValues={{
            name: "",
            currency: "default",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .required("請輸入名稱")
              .max(16, "長度最長為16個字"),
            currency: Yup.string().oneOf(currencyIds, "請選擇幣別"),
          })}
          onSubmit={async (values, actions) => {
            try {
              await createBank({
                name: values.name,
                currencyId: Number(values.currency),
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
              <div className="form-InputBar">
                <label className="form-label">名稱</label>
                <Field className="form-input" name="name" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="name"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">幣別 </label>
                <Field className="form-select" as="select" name="currency">
                  <option value="default" disabled>
                    -- 請選擇 --
                  </option>
                  {userCurrencyNode}
                </Field>
              </div>
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
