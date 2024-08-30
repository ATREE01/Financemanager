import {
  BankRecord,
  BankRecordType,
  CreateBankRecord,
  ShowState,
} from "@financemanager/financemanager-webiste-types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import styles from "@/app/components/forms/form.module.css";
import {
  useCreateBankRecordMutation,
  useModifyBankRecordMutation,
} from "@/lib/features/Bank/BankApiSlice";
import { useBanks } from "@/lib/features/Bank/BankSlice";

export default function BankRecordFrom({
  showState,
  formData,
}: {
  showState: ShowState;
  formData?: BankRecord | null;
}) {
  const mode = formData ? "modify" : "new";
  const onClick = () => showState.setShow(!showState.isShow);

  const [createBankRecord] = useCreateBankRecordMutation();
  const [modifyBankRecord] = useModifyBankRecordMutation();

  const [bankCurrency, setBankCurrency] = useState<string>("");

  const initialValues = {
    type: formData?.type || "",
    date: formData?.date || new Date().toISOString().split("T")[0],
    bank: formData?.bank.id || "",
    amount: formData?.amount || "",
    charge: formData?.charge !== null ? formData?.charge : "",
    note: formData?.note || "",
  };

  const banks = useBanks();
  const bankIds: string[] = banks.map((bank) => bank.id);

  const bankNode = banks.map((bank) => (
    <option key={bank.id} value={bank.id}>
      {bank.name}
    </option>
  ));

  useEffect(() => {
    if (formData !== undefined && formData !== null)
      setBankCurrency(formData.bank.currency.name);
  }, [formData]);

  // TODO: need to add a illustrate of how the value will be record.

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
              .oneOf(Object.values(BankRecordType), "請選擇類別"),
            bank: Yup.string()
              .required("請選擇金融機構")
              .oneOf(bankIds, "請選擇金融機構"),
            amount: Yup.number()
              .typeError("必須是數字")
              .required("請填入金額")
              .min(0, "不能小於0")
              .max(9000000000000000, "數值過大"),
            charge: Yup.number().when("type", {
              is: (type: string) => type === BankRecordType.TRANSFERIN,
              then: () =>
                Yup.number()
                  .typeError("必須是數字")
                  .required("請填入手續費或零")
                  .min(0, "不能小於零")
                  .max(2000000000, "數值過大"),
            }),
          })}
          onSubmit={async (values, actions) => {
            const body = {
              type: values.type,
              date: values.date,
              bankId: values.bank,
              amount: Number(values.amount),
              charge: Number(values.charge),
              note: values.note === "" ? null : values.note,
            } as CreateBankRecord;
            try {
              if (mode === "new") {
                await createBankRecord(body).unwrap();
              } else if (mode === "modify") {
                await modifyBankRecord({
                  id: (formData as BankRecord).id,
                  data: body,
                }).unwrap();
              }
              if (mode === "new") window.alert("新增成功");
              else window.alert("修改成功");
              actions.resetForm();
              showState.setShow(!showState.isShow);
            } catch (e) {
              console.log(e);
              window.alert("伺服器錯誤，請稍後在試");
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
                  <option disabled value="">
                    {" "}
                    -- 請選擇 --{" "}
                  </option>
                  <option value={BankRecordType.DEPOSIT}>存款</option>
                  <option value={BankRecordType.WITHDRAW}>提款</option>
                  <option value={BankRecordType.TRANSFERIN}>轉入</option>
                  <option value={BankRecordType.TRANSFEROUT}>轉出</option>
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
                <label className={styles["form-label"]}>金融機構</label>
                <Field
                  as="select"
                  className={styles["form-select"]}
                  name="bank"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    props.handleChange(e);
                    const index = banks.findIndex(
                      (item) => item.id === e.target.value,
                    );
                    setBankCurrency(banks[index].currency.name);
                  }}
                >
                  <option disabled value="">
                    {" "}
                    -- 請選擇 --{" "}
                  </option>
                  {bankNode}
                </Field>
              </div>
              <div className="-my-2 text-center text-xl">
                幣別:
                <span className="font-bold text-xl text-rose-600">
                  {bankCurrency}
                </span>
              </div>
              <ErrorMessage
                className={styles["form-ErrorMessage"]}
                name="bank"
                component="div"
              />
              <div className={styles["form-InputBar"]}>
                <label className={styles["form-label"]}>金額 </label>
                <Field className={styles["form-input"]} name="amount" />
              </div>
              <ErrorMessage
                className={styles["form-ErrorMessage"]}
                name="amount"
                component="div"
              />
              {props.values.type !== "" &&
                props.values.type !== BankRecordType.TRANSFERIN && (
                  <>
                    <div className={styles["form-InputBar"]}>
                      <label className={styles["form-label"]}>手續費 </label>
                      <Field className={styles["form-input"]} name="charge" />
                    </div>
                    <ErrorMessage
                      className={styles["form-ErrorMessage"]}
                      name="charge"
                      component="div"
                    />
                  </>
                )}
              <div className={styles["form-btn"]}>
                <button
                  className={
                    "bg-slate-300 enabled:hover:bg-slate-500 border-2 border-black rounded-full disabled:opacity-25"
                  }
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
