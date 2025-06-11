import {
  Bank,
  BrokerageFirm,
  CreateStockBuyRecord,
  CreateStockRecord,
  ShowState,
  StockBuyMethod,
  UpdateStockBuyRecord,
  UpdateStockRecord,
} from "@financemanager/financemanager-website-types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { useBanks } from "@/lib/features/Bank/BankSlice";
import { useBrokerageFirms } from "@/lib/features/BrokerageFirm/BrokerageFirmSlice";
import {
  useCreateStockRecordMutation,
  useUpdateStockRecordMutation,
} from "@/lib/features/stock/StockApiSlice";
import { useUserStocks } from "@/lib/features/stock/StockSlice";

export default function StockRecordForm({
  showState,
  formData,
}: {
  showState: ShowState;
  formData?: UpdateStockRecord | null;
}) {
  const isNew = formData === undefined;
  const record = formData?.updateStockBuyRecord;

  const banks = useBanks();
  const brokerageFirms = useBrokerageFirms();
  const userStocks = useUserStocks();
  const bankIds = banks.map((bank) => bank.id);
  const brokerageFirmIds = brokerageFirms.map((brokerageFirm) =>
    brokerageFirm.id.toString(),
  );
  const stockIds = userStocks.map((userStock) => userStock.stock.id);

  const [bank, setBank] = useState<Bank>();
  const [brokerageFirm, setBrokerageFirm] = useState<BrokerageFirm>();

  const [createStockRecord] = useCreateStockRecordMutation();
  const [updateStockRecord] = useUpdateStockRecordMutation();

  const initialValues = {
    brokerageFirmId: formData?.brokerageFirmId || "default",
    userStockId: formData?.userStockId || "",
    buyPrice: Number(formData?.buyPrice) || 0,
    buyExchangeRate: Number(formData?.buyExchangeRate) || 1,
    date: isNew ? new Date().toISOString().split("T")[0] : record?.date || "",
    bankId: record?.bankId || "",
    charge: Number(record?.charge) || 0,
    amount: Number(record?.amount) || 0,
    note: record?.note || "",
    buyMethod: (record as UpdateStockBuyRecord)?.buyMethod || "default",
    shareNumber: Number((record as UpdateStockBuyRecord)?.shareNumber) || 0,
  };

  useEffect(() => {
    const bankIdx = banks.findIndex((item) => item.id === initialValues.bankId);
    const brokerageFirmIdx = brokerageFirms.findIndex(
      (item) => item.id.toString() === initialValues.brokerageFirmId,
    );
    setBank(banks[bankIdx]);
    setBrokerageFirm(brokerageFirms[brokerageFirmIdx]);
  }, [formData]);

  const brokeragesNode = brokerageFirms.map((brokerageFirm) => (
    <option key={brokerageFirm.id} value={brokerageFirm.id}>
      {brokerageFirm.name}
    </option>
  ));
  const stocksNode = userStocks.map((userStock) => (
    <option key={userStock.id} value={userStock.id}>
      {userStock.name}
    </option>
  ));

  return (
    <>
      {showState.isShow ? (
        <div
          className="form-scrim"
          onClick={() => showState.setShow(!showState.isShow)}
        ></div>
      ) : (
        ""
      )}
      <div
        className={`text-black form-container ${showState.isShow ? "activate" : ""}`}
      >
        <div className="close-btn">
          <i
            className="bi bi-x-circle-fill"
            onClick={() => showState.setShow(!showState.isShow)}
          ></i>
        </div>
        <div className="form-title">
          {isNew === true ? "新增紀錄" : "修改紀錄"}
        </div>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            bankId: Yup.string().oneOf(bankIds, "請選擇金融機構"),
            brokerageId: Yup.string().oneOf(brokerageFirmIds, "請選擇券商"),
            stockId: Yup.string().oneOf(stockIds, "請選擇股票"),

            buyMethod: Yup.string().oneOf(
              Object.values(StockBuyMethod),
              "請選擇買入方法",
            ),

            buyPrice: Yup.number()
              .required("請填入買入股價")
              .typeError("請輸入數字")
              .moreThan(0, "數值必須大於零")
              .max(200000000, "數值過大"),
            buyExchangeRate: Yup.number()
              .required("請填入買入匯率")
              .moreThan(0, "數值必須大於零")
              .max(200000000, "數值過大"),

            shareNumber: Yup.number()
              .required("請輸入股數")
              .typeError("請輸入數字")
              .moreThan(0, "數值必須大於零")
              .max(200000000, "數值過大"),
            charge: Yup.number()
              .required("請輸入手續費")
              .typeError("請輸入數字")
              .moreThan(0, "數值必須大於零")
              .max(200000000, "數值過大"),

            amount: Yup.number()
              .required("請輸入總金額")
              .typeError("請輸入數字")
              .moreThan(0, "數值必須大於零")
              .max(200000000, "數值過大"),
            note: Yup.string(),
          })}
          onSubmit={async (values, actions) => {
            /* 
                            Since the difference of update and create interface is only the id
                            and when sending data to backend the id is in URL so I used create interface here.
                        */
            const body = {
              id: formData?.id,
              brokerageFirmId: values.brokerageFirmId,
              userStockId: values.userStockId,
              buyPrice: Number(values.buyPrice),
              buyExchangeRate: Number(values.buyExchangeRate),
            };
            const commonField = {
              date: values.date,
              bankId: values.bankId,
              buyMethod: values.buyMethod,
              shareNumber: Number(values.shareNumber),
              charge: Number(values.charge),
              amount: Number(values.amount),
              note: values.note || null,
            };
            if (isNew)
              (body as CreateStockRecord).createStockBuyRecord = {
                ...commonField,
              } as CreateStockBuyRecord;
            else if (!isNew) {
              (body as UpdateStockRecord).updateStockBuyRecord = {
                id: (record as UpdateStockBuyRecord).id,
                ...commonField,
              } as UpdateStockBuyRecord;
            }
            try {
              if (isNew) {
                await createStockRecord(body as CreateStockRecord).unwrap();
              } else if (!isNew) {
                await updateStockRecord(body as UpdateStockRecord).unwrap();
              }
              showState.setShow(!showState.setShow);
              if (isNew) window.alert("新增成功");
              else window.alert("修改成功");
              actions.resetForm();
            } catch (e) {
              window.alert("發生不明錯誤");
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
                <label className="form-label">券商</label>
                <Field
                  className="form-input"
                  name="brokerageFirmId"
                  as="select"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    props.handleChange(e);
                    const index = brokerageFirms.findIndex(
                      (item) => item.id.toString() === e.target.value,
                    );
                    setBrokerageFirm(brokerageFirms[index]);
                  }}
                >
                  <option value="">-- 請選擇 --</option>
                  {brokeragesNode}
                </Field>
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="brokerageFirmId"
                component="div"
              />
              <div className="-my-2 text-center text-xl">
                交易幣別:{" "}
                <span className="font-bold text-xl text-rose-600">
                  {brokerageFirm?.transactionCurrency.name}{" "}
                </span>
                交割幣別:{" "}
                <span className="font-bold text-xl text-rose-600">
                  {brokerageFirm?.settlementCurrency.name}
                </span>
              </div>
              <div className="form-InputBar">
                <label className="form-label">買入方法</label>
                <Field className="form-select" name="buyMethod" as="select">
                  <option value="default" disabled>
                    -- 請選擇 --
                  </option>
                  <option value={StockBuyMethod.MANULLY}>手動買入</option>
                  <option value={StockBuyMethod.REGULAR}>定期定額</option>
                </Field>
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="buyMethod"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">付款機構</label>
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
                  {brokerageFirm &&
                    banks.map((item, index) => {
                      if (
                        item?.currency.id ===
                        brokerageFirm?.settlementCurrency.id
                      ) {
                        return (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        );
                      }
                    })}
                </Field>
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="bankId"
                component="div"
              />
              <div className="-my-2 text-center text-xl">
                所選銀行幣別:
                <span className="font-bold text-xl text-rose-600">
                  {bank?.currency.name}
                </span>
              </div>
              {brokerageFirm?.transactionCurrency.code !==
                brokerageFirm?.settlementCurrency.code && (
                <>
                  <div className="form-InputBar">
                    <label className="form-label">買入匯率</label>
                    <Field
                      className="form-input disabled:brightness-75"
                      name="buyExchangeRate"
                    />
                  </div>
                  <ErrorMessage
                    className="form-ErrorMessage"
                    name="buyExchangeRate"
                    component="div"
                  />
                </>
              )}

              <div className="form-InputBar">
                <label className="form-label">股票</label>
                <Field className="form-input" name="userStockId" as="select">
                  <option> -- 請選擇 -- </option>
                  {stocksNode}
                </Field>
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="userStockId"
                component="div"
              />

              <div className="form-InputBar">
                <label className="form-label">買入股價</label>
                <Field
                  className="form-input disabled:brightness-75"
                  name="buyPrice"
                />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="buyPrice"
                component="div"
              />

              <div className="form-InputBar">
                <label className="form-label">股數</label>
                <Field className="form-input" name="shareNumber" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="shareNumber"
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

              <div className="form-InputBar">
                <label className="form-label">總金額</label>
                <Field className="form-input" name="amount" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="amount"
                component="div"
              />
              <div className="-my-2 text-center text-xl">
                <span className="font-bold text-xl text-orange-600">
                  股價 * 股數 + 手續費
                </span>
              </div>

              <div className="form-InputBar">
                <label className="form-label">備註</label>
                <Field
                  as="textarea"
                  className="form-input note"
                  name="note"
                  type="text"
                />
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
