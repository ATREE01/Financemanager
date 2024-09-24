import {
  Bank,
  CreateTimeDepositRecord,
  ShowState,
  TimeDepositRecord,
} from "@financemanager/financemanager-webiste-types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import {
  useCreateTimeDepositRecordMutation,
  useModifyTimeDepositRecordMutation,
} from "@/lib/features/Bank/BankApiSlice";
import { useBanks } from "@/lib/features/Bank/BankSlice";

export default function TimeDepositRecordForm({
  showState,
  formData,
}: {
  showState: ShowState;
  formData?: TimeDepositRecord | null;
}) {
  const banks = useBanks();
  const [bank, setBank] = useState<Bank>();

  const [createTimeDepositRecord] = useCreateTimeDepositRecordMutation();
  const [modifyTimeDepositRecord] = useModifyTimeDepositRecordMutation();

  useEffect(() => {
    setBank(formData?.bank);
  }, [formData]);

  const bankIds: string[] = [];
  const bankContent = banks.map((bank) => {
    bankIds.push(bank.id);
    return (
      <option key={bank.id} value={bank.id}>
        {bank.name}
      </option>
    );
  });

  const mode = formData === undefined ? "new" : "modify";

  const onClick = () => showState.setShow(!showState.isShow);

  const initialValues = {
    name: formData?.name || "",
    bankId: formData?.bank.id || "",
    amount: formData?.amount || "",
    interestRate: formData?.interestRate || "",
    startDate: formData?.startDate || new Date().toISOString().split("T")[0],
    endDate: formData?.endDate || "",
  };

  return (
    <>
      {showState.isShow && <div className="form-scrim" onClick={onClick}></div>}
      <div
        className={`text-black form-container ${showState.isShow ? "activate" : ""}`}
      >
        <div className="close-btn">
          <i className="bi bi-x-circle-fill" onClick={onClick}></i>
        </div>
        <div className="form-title">
          {mode === "new" ? "新增定存" : "修改紀錄"}
        </div>
        <Formik
          enableReinitialize //  Control whether Formik should reset the form if initialValues changes
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            bankId: Yup.string()
              .required("請選擇金融機構")
              .oneOf(bankIds, "請選擇金融機構"),
            amount: Yup.number()
              .required("請輸入金額")
              .typeError("只能輸入數字")
              .min(0, "不能小於0"),
            interestRate: Yup.string()
              .required("請輸入利率")
              .matches(/^(\d{1,4}(\.\d{1,4})?)%$/, "請確認所輸入的利率格式"),
            startDate: Yup.date().required("請選擇開始日期"),
            endDate: Yup.date()
              .required("請選結束擇日期")
              .min(Yup.ref("startDate"), "結束日期不能早於開始日期"),
          })}
          onSubmit={async (values, actions) => {
            const body = {
              name: values.name,
              bankId: values.bankId,
              amount: Number(values.amount),
              interestRate: values.interestRate,
              startDate: values.startDate,
              endDate: values.endDate,
            } as CreateTimeDepositRecord;
            try {
              if (mode === "new") await createTimeDepositRecord(body).unwrap();
              else
                await modifyTimeDepositRecord({
                  id: (formData as TimeDepositRecord).id,
                  data: body,
                }).unwrap();
              showState.setShow(!showState.isShow);
              if (mode === "new") window.alert("新增成功");
              else window.alert("修改成功");
              actions.resetForm();
            } catch (e) {
              window.alert("伺服器錯誤，請稍後再試");
            }
          }}
        >
          {(props) => (
            <Form>
              <div className="form-InputBar">
                <label className="form-label">金融機構</label>
                <Field
                  as="select"
                  className="form-select"
                  name="bankId"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    props.handleChange(e);
                    const index = banks.findIndex(
                      (item) => item.id === e.target.value,
                    );
                    setBank(banks[index]);
                  }}
                >
                  <option value=""> -- 請選擇 -- </option>
                  {bankContent}
                </Field>
              </div>
              <div className="-my-2 text-center text-xl form-currency">
                幣別:
                <span className="font-bold text-xl text-rose-600 form-currency-text">
                  {bank?.currency.name}
                </span>
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="bankId"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">名稱</label>
                <Field
                  className="form-input"
                  name="name"
                  placeholder="任意名稱"
                />
              </div>
              <div className="form-InputBar">
                <label className="form-label">金額</label>
                <Field className="form-input" name="amount" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="amount"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">利率</label>
                <Field
                  className="form-input"
                  name="interestRate"
                  placeholder="Ex:1.5%"
                />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="interest"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">開始日期</label>
                <Field className="form-input" name="startDate" type="date" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="startDate"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">結束日期</label>
                <Field className="form-input" name="endDate" type="date" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="endDate"
                component="div"
              />
              <div className="form-btn">
                <button
                  className={`bg-slate-300 enabled:hover:bg-slate-500 border-2 border-black rounded-full disabled:opacity-25`}
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
