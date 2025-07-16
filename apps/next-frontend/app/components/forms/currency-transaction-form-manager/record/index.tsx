import {
  Bank,
  CreateCurrencyTransactionRecord,
  CurrencyTransactionRecord,
  CurrencyTransactionRecordType,
  ShowState,
} from "@financemanager/financemanager-website-types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";

import LoadingPage from "@/app/components/loading-page";
import { useGetBanksQuery } from "@/lib/features/Bank/BankApiSlice";
import {
  useCreateCurrencyTransactionRecordMutation,
  useGetCurrenciesQuery,
  useGetUserCurrenciesQuery,
  useUpdateCurrencyTransactionRecordMutation,
} from "@/lib/features/Currency/CurrencyApiSlice";

export default function CurrencyTransactionRecordForm({
  showState,
  formData,
}: {
  showState: ShowState;
  formData?: CurrencyTransactionRecord | null;
}) {
  const mode = formData === undefined ? "new" : "update";
  const onClick = () => showState.setShow(!showState.isShow);

  const { data: banks = [], isLoading: bankIsLoading } = useGetBanksQuery();
  const { data: userCurrencies = [], isLoading: userCurrenciesIsLoading } =
    useGetUserCurrenciesQuery();
  const { data: currencies = [], isLoading: currenciesIsLoading } =
    useGetCurrenciesQuery();
  const currencyIds = currencies.map((item) => item.id.toString());
  const bankIds = banks.map((item) => item.id);
  const [createCurrencyTransactionRecord] =
    useCreateCurrencyTransactionRecordMutation();
  const [updateCurrencyTransactionRecord] =
    useUpdateCurrencyTransactionRecordMutation();
  const [type, setType] = useState("default");
  const [fromBank, setFromBank] = useState<Bank>();
  const [toBank, setToBank] = useState<Bank>();

  if (bankIsLoading || currenciesIsLoading || userCurrenciesIsLoading)
    return <LoadingPage />;

  const banksNode = banks.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  const userCurrenciesNode = userCurrencies.map((item) => (
    <option key={item.id} value={item.currency.id}>
      {item.currency.name}
    </option>
  ));

  const initialValues = {
    date: formData?.date || new Date().toISOString().split("T")[0],
    type: formData?.type || "",
    fromBankId: formData?.fromBank?.id || "default",
    toBankId: formData?.toBank?.id || "default",
    fromCurrencyId: formData?.fromCurrency?.id || "default",
    toCurrencyId: formData?.toCurrency?.id || "default",
    fromAmount: formData?.fromAmount || 0,
    toAmount: formData?.toAmount || 0,
    exchangeRate: formData?.exchangeRate || 0,
    charge: formData?.charge || 0,
  };

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
        <div className="form-title">
          {mode === "new" ? "新增紀錄" : "修改紀錄"}
        </div>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            type: Yup.string()
              .required("請選擇類別")
              .oneOf(
                [
                  CurrencyTransactionRecordType.ONLINE,
                  CurrencyTransactionRecordType.COUNTER,
                ],
                "請選擇類別",
              ),
            fromBankId: Yup.string().when("type", {
              is: CurrencyTransactionRecordType.ONLINE,
              then: () =>
                Yup.string()
                  .required("請選擇機構")
                  .oneOf(bankIds, "請選擇機構"),
            }),
            toBankId: Yup.string().when("type", {
              is: CurrencyTransactionRecordType.ONLINE,
              then: () =>
                Yup.string()
                  .required("請選擇機構")
                  .oneOf(bankIds, "請選擇機構"),
            }),
            fromCurrencyId: Yup.string().when("type", {
              is: CurrencyTransactionRecordType.COUNTER,
              then: () =>
                Yup.string()
                  .required("請選擇幣別")
                  .oneOf(currencyIds, "請選擇幣別"),
            }),
            toCurrencyId: Yup.string().when("type", {
              is: CurrencyTransactionRecordType.COUNTER,
              then: () =>
                Yup.string()
                  .required("請選擇幣別")
                  .oneOf(currencyIds, "請選擇幣別"),
            }),
            fromAmount: Yup.number()
              .typeError("請輸入數字")
              .required("請輸入金額")
              .min(0, "不能小於0")
              .max(2000000000, "數值過大"),
            toAmount: Yup.number()
              .typeError("請輸入數字")
              .required("請輸入金額")
              .min(0, "不能小於0")
              .max(2000000000, "數值過大"),
            exchangeRate: Yup.number()
              .typeError("請輸入數字")
              .required("請輸入匯率")
              .min(0, "不能小於0")
              .max(2000000000, "數值過大"),
            charge: Yup.number()
              .typeError("請輸入數字")
              .required("請輸入金額")
              .min(0, "不能小於玲0")
              .max(2000000000, "數值過大"),
          })}
          onSubmit={async (values, actions) => {
            const body: CreateCurrencyTransactionRecord = {
              date: values.date,
              type: values.type as CurrencyTransactionRecordType,
              fromBankId:
                values.fromBankId === "default" ? null : values.fromBankId,
              toBankId: values.toBankId === "default" ? null : values.toBankId,
              fromCurrencyId:
                values.fromCurrencyId === "default"
                  ? null
                  : Number(values.fromCurrencyId),
              toCurrencyId:
                values.toCurrencyId === "default"
                  ? null
                  : Number(values.toCurrencyId),
              fromAmount: Number(values.fromAmount),
              toAmount: Number(values.toAmount),
              exchangeRate: Number(values.exchangeRate),
              charge: Number(values.charge),
            };
            try {
              if (mode === "new")
                await createCurrencyTransactionRecord(body).unwrap();
              else if (mode === "update")
                await updateCurrencyTransactionRecord({
                  id: (formData as CurrencyTransactionRecord).id,
                  data: body,
                }).unwrap();
              showState.setShow(!showState.isShow);
              actions.resetForm();
              setType("default");
              setFromBank(undefined);
              setToBank(undefined);
              window.alert(`${mode === "new" ? "新增" : "修改"}成功`);
            } catch {
              window.alert("伺服器錯誤，請稍後再試");
            }
          }}
        >
          {(props) => (
            <Form>
              <div className="form-InputBar">
                <label className="form-label">日期</label>
                <Field className="form-input" name="date" type="date" />
              </div>
              <div className="form-InputBar">
                <label className="form-label">類別</label>
                <Field
                  as="select"
                  className="form-select"
                  name="type"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    props.handleChange(e);
                    setType(e.target.value);
                    if (
                      e.target.value === CurrencyTransactionRecordType.ONLINE
                    ) {
                      props.setFieldValue("fromCurrencyId", "default");
                      props.setFieldValue("toCurrencyId", "default");
                    } else if (
                      e.target.value === CurrencyTransactionRecordType.COUNTER
                    ) {
                      props.setFieldValue("fromBankId", "default");
                      props.setFieldValue("toBankId", "default");
                    }
                  }}
                >
                  <option value=""> -- 請選擇 -- </option>
                  <option value={CurrencyTransactionRecordType.ONLINE}>
                    線上換匯
                  </option>
                  <option value={CurrencyTransactionRecordType.COUNTER}>
                    櫃檯換匯
                  </option>
                </Field>
              </div>
              {type === CurrencyTransactionRecordType.ONLINE && (
                <>
                  <div className="form-InputBar">
                    <label className="form-label">出金機構</label>
                    <Field
                      as="select"
                      className="form-select"
                      name="fromBankId"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        props.handleChange(e);
                        setFromBank(
                          banks.find((item) => item.id === e.target.value),
                        );
                      }}
                    >
                      <option disabled value="default">
                        {" "}
                        -- 請選擇 --{" "}
                      </option>
                      {banksNode}
                    </Field>
                  </div>
                  <div className="-mt-2 text-center text-xl">
                    幣別:
                    <span className="font-bold text-xl text-rose-600">
                      {fromBank?.currency.name}
                    </span>
                  </div>
                  <ErrorMessage
                    className="form-ErrorMessage"
                    name="fromBankId"
                    component="div"
                  />
                  <div className="form-InputBar">
                    <label className="form-label"> 入金機構</label>
                    <Field
                      as="select"
                      className="form-select"
                      name="toBankId"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        props.handleChange(e);
                        setToBank(
                          banks.find((item) => item.id === e.target.value),
                        );
                      }}
                    >
                      <option disabled value="default">
                        {" "}
                        -- 請選擇 --{" "}
                      </option>
                      {banksNode}
                    </Field>
                  </div>
                  <div className="-mt-2 text-center text-xl">
                    幣別:
                    <span className="font-bold text-xl text-rose-600">
                      {toBank?.currency.name}
                    </span>
                  </div>
                  <ErrorMessage
                    className="form-ErrorMessage"
                    name="toBankId"
                    component="div"
                  />
                </>
              )}
              {type === CurrencyTransactionRecordType.COUNTER && (
                <>
                  <div className="form-InputBar">
                    <label className="form-label">賣出幣別</label>
                    <Field
                      as="select"
                      className="form-select"
                      name="fromCurrencyId"
                    >
                      <option disabled value="default">
                        {" "}
                        -- 請選擇 --{" "}
                      </option>
                      {userCurrenciesNode}
                    </Field>
                  </div>
                  <ErrorMessage
                    className="form-ErrorMessage"
                    name="fromCurrencyId"
                    component="div"
                  />
                  <div className="form-InputBar">
                    <label className="form-label">買入幣別</label>
                    <Field
                      as="select"
                      className="form-select"
                      name="toCurrencyId"
                    >
                      <option disabled value="default">
                        {" "}
                        -- 請選擇 --{" "}
                      </option>
                      {userCurrenciesNode}
                    </Field>
                  </div>
                  <ErrorMessage
                    className="form-ErrorMessage"
                    name="toCurrencyId"
                    component="div"
                  />
                </>
              )}
              <div className="form-InputBar">
                <label className="form-label">賣出金額</label>
                <Field className="form-input" name="fromAmount" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="fromAmount"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">買入金額</label>
                <Field className="form-input" name="toAmount" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="toAmount"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">匯率</label>
                <Field className="form-input" name="exchangeRate" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="exchangeRate"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">手續費</label>
                <Field className="form-input" name="charge" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="charge"
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
