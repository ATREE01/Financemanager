import {
  Bank,
  Category,
  CreateIncExpRecord,
  IncExpMethodType,
  IncExpRecord,
  IncExpRecordType,
  ShowState,
} from "@financemanager/financemanager-webiste-types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import styles from "@/app/components/forms/form.module.css";
import { useBanks } from "@/lib/features/Bank/BankSlice";
import { useCategories } from "@/lib/features/Category/CategorySlice";
import { useUserCurrencies } from "@/lib/features/Currency/CurrencySlice";
import {
  useCreateIncExpRecordMutation,
  useModifyIncExpRecordMutation,
} from "@/lib/features/IncExp/IncExpApiSlice";

export default function IncExpRecordForm({
  showState,
  formData,
}: {
  showState: ShowState;
  formData?: IncExpRecord | null;
}) {
  const [createIncExpRecord] = useCreateIncExpRecordMutation();
  const [modifyIncExpRecord] = useModifyIncExpRecordMutation();

  const [type, setType] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [bank, setBank] = useState<Bank | null>(null); // this is to indicate the currency of selected bank

  useEffect(() => {
    setType(formData?.type ?? "");
    setMethod(formData?.method ?? "");
    setBank(formData?.bank ?? null);
  }, [formData]);

  const mode = formData === undefined ? "new" : "modify";

  const initialValues = {
    type: formData?.type || "",
    date: formData?.date || new Date().toISOString().split("T")[0],
    categoryId: formData?.category.id || "",
    currencyId: formData?.currency.id || "",
    amount: formData?.amount || "",
    method: formData?.method || "default",
    bankId: formData?.bank?.id || "",
    charge: formData?.charge || "",
    note: formData?.note || "",
  };

  const onClick = () => showState.setShow(!showState.isShow);

  // get categories
  const categories = useCategories();
  const categoryIds: string[] = [
    ...categories["income"],
    ...categories["expense"],
  ].map((item: Category) => item.id);
  const incomeCategoryNode = categories["income"].map((item) => {
    return (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    );
  });
  const expenseCategoryNode = categories["expense"].map((item) => {
    return (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    );
  });

  //get banks
  const banks = useBanks();
  const bankIds = banks.map((item: Bank) => item.id);
  const bankNode = banks.map((item: Bank) => {
    return (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    );
  });

  //get user currencies
  const userCurrencies = useUserCurrencies();
  const currencyIds = userCurrencies.map((item) => item.currency.id);
  const userCurrenciesNode = userCurrencies.map((item) => {
    return (
      <option key={item.id} value={item.currency.id}>
        {item.currency.name}
      </option>
    );
  });

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
        <div className={styles["form-title"]}>
          {mode === "new" ? "新增紀錄" : "修改紀錄"}
        </div>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            type: Yup.string()
              .required("請選擇類別")
              .oneOf(Object.values(IncExpRecordType), "請選擇類別"),
            amount: Yup.number()
              .required("請填入金額")
              .typeError("只能填入數字")
              .moreThan(0, "請填入大於零的數字")
              .max(2000000000, "數值過大"),
            currencyId: Yup.number().when("method", {
              is: IncExpMethodType.CASH,
              then: () =>
                Yup.number()
                  .required("請選擇幣別")
                  .oneOf(currencyIds, "請選擇幣別"),
            }),
            categoryId: Yup.string()
              .required("請選擇種類")
              .oneOf(categoryIds, "請選擇種類"),
            method: Yup.string()
              .required("請選擇方式")
              .oneOf(Object.values(IncExpMethodType), "請選擇方式"),
            bankId: Yup.string().when("_", {
              is: () => method === IncExpMethodType.FINANCE,
              then: () =>
                Yup.string()
                  .required("請選擇金融機構")
                  .oneOf(bankIds, "請選擇金融機構"),
            }),
            charge: Yup.number().when("_", {
              is: () =>
                type === IncExpRecordType.EXPENSE &&
                method === IncExpMethodType.FINANCE,
              then: () =>
                Yup.number()
                  .required("請填入手續費或0")
                  .min(0, "不能小於0")
                  .max(2000000000, "數值過大"),
            }),
          })}
          onSubmit={async (values, actions) => {
            // showState.setShow(!showState.isShow);
            console.log(values);
            const body = {
              date: values.date,
              type: values.type,
              categoryId: values.categoryId,
              currencyId:
                method === IncExpMethodType.CASH
                  ? Number(values.currencyId)
                  : Number(bank?.currency.id),
              amount: Number(values.amount),
              method: values.method,
              bankId: values.bankId === "" ? null : values.bankId,
              charge: values.charge === "" ? null : Number(values.charge),
              note: values.note === "" ? null : values.note,
            } as CreateIncExpRecord;
            try {
              if (mode === "new") {
                await createIncExpRecord(body).unwrap();
              } else if (mode === "modify") {
                await modifyIncExpRecord({
                  id: (formData as IncExpRecord).id,
                  data: body,
                }).unwrap();
              }
              window.alert(`${mode === "new" ? "新增成功" : "修改成功"}`);
              setMethod("");
              actions.resetForm();
              showState.setShow(false);
            } catch (err) {
              window.alert("伺服器錯誤，請稍後再試");
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    props.handleChange(e);
                    props.setFieldValue("categoryId", "deafult");
                    if (e.target.value === IncExpRecordType.INCOME)
                      props.setFieldValue("charge", "");
                    setType(e.target.value);
                  }}
                >
                  <option value="">-- 請選擇 --</option>
                  <option value={IncExpRecordType.INCOME}>收入</option>
                  <option value={IncExpRecordType.EXPENSE}>支出</option>
                </Field>
              </div>
              <ErrorMessage
                className={styles["form-ErrorMessage"]}
                name="type"
                component="div"
              />
              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>日期</label>
                <Field
                  className={styles["form-input"]}
                  name="date"
                  type="date"
                />
              </div>

              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>種類 </label>
                <Field
                  as="select"
                  className={styles["form-select"]}
                  name="categoryId"
                >
                  <option value="">-- 請選擇類別 --</option>
                  {type === IncExpRecordType.INCOME ? incomeCategoryNode : ""}
                  {type === IncExpRecordType.EXPENSE ? expenseCategoryNode : ""}
                </Field>
              </div>
              <ErrorMessage
                className={styles["form-ErrorMessage"]}
                name="categoryId"
                component="div"
              />

              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>金額</label>
                <Field className={styles["form-input"]} name="amount" />
              </div>
              <ErrorMessage
                className={styles["form-ErrorMessage"]}
                name="amount"
                component="div"
              />

              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>收支方式</label>
                <Field
                  as="select"
                  className={styles["form-select"]}
                  name="method"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    props.handleChange(e);
                    setMethod(e.target.value);
                    if (e.target.value !== IncExpMethodType.CASH) setBank(null);
                    props.setFieldValue("bank", "default");
                  }}
                >
                  <option value="default">-- 請選擇 --</option>
                  <option value={IncExpMethodType.CASH}>現金交易</option>
                  <option value={IncExpMethodType.FINANCE}>金融交易</option>
                </Field>
              </div>
              <ErrorMessage
                className={styles["form-ErrorMessage"]}
                name="method"
                component="div"
              />

              {method === IncExpMethodType.FINANCE ? (
                <>
                  <div className={styles["form-InputBar"]}>
                    <label className={styles["form-label"]}>金融機構</label>
                    <Field
                      as="select"
                      className={styles["form-select"]}
                      name="bankId"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        props.handleChange(e);
                        const index = banks.findIndex(
                          (item) => item.id === e.target.value,
                        );
                        setBank(banks[index]);
                      }}
                    >
                      <option value="">-- 請選擇 --</option>
                      {bankNode}
                    </Field>
                  </div>
                  <div className="-my-2 text-center text-xl">
                    幣別:
                    <span className="font-bold text-xl text-rose-600">
                      {bank?.currency.name}
                    </span>
                  </div>
                  <ErrorMessage
                    className={styles["form-ErrorMessage"]}
                    name="bankId"
                    component="div"
                  />
                  {props.values.type === IncExpRecordType.EXPENSE && (
                    <>
                      <div className={styles["form-InputBar"]}>
                        <label className={styles["form-label"]}>手續費</label>
                        <Field className={styles["form-input"]} name="charge" />
                      </div>
                      <ErrorMessage
                        className={styles["form-ErrorMessage"]}
                        name="charge"
                        component="div"
                      />
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className={styles["form-InputBar"]}>
                    <label className={styles["form-label"]}>幣別</label>
                    <Field
                      as="select"
                      className={styles["form-select"]}
                      name="currencyId"
                    >
                      <option value="">-- 請選擇 --</option>
                      {userCurrenciesNode}
                    </Field>
                  </div>
                  <ErrorMessage
                    className={styles["form-ErrorMessage"]}
                    name="currencyId"
                    component="div"
                  />
                </>
              )}

              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>備註</label>
                <Field
                  as="textarea"
                  className={`${styles["form-input"]} ${styles["note"]}`}
                  name="note"
                  type="text"
                />
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