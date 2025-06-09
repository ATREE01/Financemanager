import {
  Bank,
  BrokerageFirm,
  CreateStockBundleSellRecord,
  ShowState,
  StockRecordSummarySell,
  UpdateStockBundleSellRecord,
} from "@financemanager/financemanager-website-types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

import { useBanks } from "@/lib/features/Bank/BankSlice";
import {
  useCreateStockBundleSellRecordMutation,
  useUdpateStockBundleSellRecordMutation,
} from "@/lib/features/stock/StockApiSlice";

export default function BundleSellRecord({
  showState,
  formData,
  stockRecordSummarySell,
}: {
  showState: ShowState;
  formData?: UpdateStockBundleSellRecord | null;
  stockRecordSummarySell?: StockRecordSummarySell;
}) {
  const isNew = formData === undefined;

  const banks = useBanks();
  const bankIds = banks.map((bank) => bank.id);

  const [brokerageFirm, setBrokerageFirm] = useState<BrokerageFirm | null>(
    null,
  );
  const [bank, setBank] = useState<Bank>();

  const [createStockBundleSellRecord] =
    useCreateStockBundleSellRecordMutation();
  const [UpdateStockBundleSellRecord] =
    useUdpateStockBundleSellRecordMutation();

  const initialValues = {
    date: isNew ? new Date().toISOString().split("T")[0] : formData?.date || "",
    bankId: formData?.bankId || "",

    sellPrice: Number(formData?.sellPrice) || 0,
    sellExchangeRate: Number(formData?.sellExchangeRate) || 1,
    charge: Number(formData?.charge) || 0,
    tax: Number(formData?.tax) || 0,
    amount: Number(formData?.amount) || 0,
    note: formData?.note || "",
  };

  useEffect(() => {
    const bankIdx = banks.findIndex((item) => item.id === initialValues.bankId);
    setBank(banks[bankIdx]);

    if (isNew && stockRecordSummarySell) {
      setBrokerageFirm(stockRecordSummarySell.brokerageFirm);
    } else if (formData) {
      setBrokerageFirm(formData.brokerageFirm);
    }
  }, [stockRecordSummarySell, formData]);

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
          {isNew === true ? "新增賣出紀錄" : "修改紀錄"}
        </div>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            bankId: Yup.string()
              .required("請選擇金融機構")
              .oneOf(bankIds, "請選擇金融機構"),

            sellPrice: Yup.number()
              .required("請填入賣出股價")
              .typeError("請輸入數字")
              .moreThan(0, "數值必須大於零")
              .max(200000000, "數值過大"),

            sellExchangeRate: Yup.number()
              .moreThan(0, "數值必須大於零")
              .max(200000000, "數值過大"),

            charge: Yup.number()
              .required("請輸入手續費")
              .typeError("請輸入數字")
              .moreThan(0, "數值必須大於零")
              .max(200000000, "數值過大"),
            tax: Yup.number()
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
            const commonBody = {
              date: values.date,
              bankId: values.bankId,
              sellPrice: Number(values.sellPrice),
              sellExchangeRate: Number(values.sellExchangeRate),
              charge: Number(values.charge),
              tax: Number(values.tax),
              amount: Number(values.amount),
              note: values.note || null,
            };

            try {
              if (isNew) {
                await createStockBundleSellRecord({
                  ...commonBody,
                  brokerageFirmId: (brokerageFirm as BrokerageFirm).id,
                  userStockId: (
                    stockRecordSummarySell as StockRecordSummarySell
                  ).userStockId,
                  createStockSellRecords: (
                    stockRecordSummarySell as StockRecordSummarySell
                  ).stockRecordSellShare,
                } as CreateStockBundleSellRecord).unwrap();
              } else if (!isNew) {
                await UpdateStockBundleSellRecord({
                  id: (formData as UpdateStockBundleSellRecord).id,
                  data: commonBody as UpdateStockBundleSellRecord,
                }).unwrap();
              }
              actions.resetForm();
              showState.setShow(!showState.setShow);
              window.location.reload();
              if (isNew) window.alert("新增成功");
              else window.alert("修改成功");
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
                    <label className="form-label">賣出匯率</label>
                    <Field className="form-input" name="sellExchangeRate" />
                  </div>
                  <ErrorMessage
                    className="form-ErrorMessage"
                    name="sellExchangeRate"
                    component="div"
                  />
                </>
              )}

              <div className="form-InputBar">
                <label className="form-label">賣出股價</label>
                <Field className="form-input" name="sellPrice" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="sellPrice"
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
                <label className="form-label">稅金</label>
                <Field className="form-input" name="tax" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="tax"
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
                  股價*股數 - 手續費 - 稅金
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
