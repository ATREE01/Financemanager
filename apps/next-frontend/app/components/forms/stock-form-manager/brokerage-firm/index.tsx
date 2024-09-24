import {
  CreateBrokerageFirm,
  ShowState,
} from "@financemanager/financemanager-webiste-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { useCreateBrokerageFirmMutation } from "@/lib/features/BrokerageFirm/BrokerageFirmApiSlice";
import { useUserCurrencies } from "@/lib/features/Currency/CurrencySlice";

export default function BrokerageFirmForm({
  showState,
}: {
  showState: ShowState;
}) {
  const [createBrokerageFirm] = useCreateBrokerageFirmMutation();

  const onClick = () => showState.setShow(!showState.isShow);
  const userCurrencies = useUserCurrencies();
  const currencyIds = userCurrencies.map((userCurrency) =>
    userCurrency.currency.id.toString(),
  );
  const currenciesNode = userCurrencies.map((userCurrency) => (
    <option key={userCurrency.id} value={userCurrency.currency.id}>
      {userCurrency.currency.name}
    </option>
  ));

  return (
    <>
      {showState.isShow && <div className="form-scrim" onClick={onClick}></div>}
      <div
        className={`text-black form-container ${showState.isShow ? "activate" : ""}`}
      >
        <div className="close-btn">
          <i className="bi bi-x-circle-fill" onClick={onClick}></i>
        </div>
        <div className="form-title">新增券商</div>
        <Formik
          initialValues={{
            name: "",
            trasnactionCurrencyId: "default",
            settlementCurrencyId: "default",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .required("請輸入名稱")
              .max(16, "最多只能輸入16個字"),
            transactionCurrency: Yup.string().oneOf(
              currencyIds,
              "請選擇交易幣別",
            ),
            settlementCurrency: Yup.string().oneOf(
              currencyIds,
              "請選擇交割幣別",
            ),
          })}
          onSubmit={async (values, actions) => {
            const body: CreateBrokerageFirm = {
              name: values.name,
              transactionCurrencyId: Number(values.trasnactionCurrencyId),
              settlementCurrencyId: Number(values.settlementCurrencyId),
            };
            try {
              await createBrokerageFirm(body).unwrap();
              window.alert("新增成功");
              actions.resetForm();
              showState.setShow(false);
            } catch (err: unknown) {
              if ((err as FetchBaseQueryError).status === 409)
                actions.setFieldError("name", "此名稱已存在");
              else window.alert("伺服器錯誤，請稍後再試");
            }
          }}
        >
          {(props) => (
            <Form>
              <div className="form-InputBar">
                <label className="form-label">名稱</label>
                <Field
                  as="input"
                  className="form-input"
                  name="name"
                  placeholder="類別名稱"
                />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="name"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">交割幣別 </label>
                <Field
                  as="select"
                  className="form-select"
                  name="settlementCurrencyId"
                >
                  <option value="default"> -- 請選擇 -- </option>
                  {currenciesNode}
                </Field>
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="settlementCurrencyId"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">交易幣別 </label>
                <Field
                  as="select"
                  className="form-select"
                  name="trasnactionCurrencyId"
                >
                  <option value="default"> -- 請選擇 -- </option>
                  {currenciesNode}
                </Field>
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="trasnactionCurrencyId"
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
