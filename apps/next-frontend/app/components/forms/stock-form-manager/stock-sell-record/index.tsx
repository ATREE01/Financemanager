import {
  ShowState,
  UpdateStockSellRecord,
} from "@financemanager/financemanager-webiste-types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { useUpdateStockSellRecordMutation } from "@/lib/features/stock/StockApiSlice";

export default function StockSellRecord({
  showState,
  updateFormData,
}: {
  showState: ShowState;
  updateFormData?: UpdateStockSellRecord | null;
}) {
  const [updateStockSellRecord] = useUpdateStockSellRecordMutation();
  const onClick = () => showState.setShow(!showState.isShow);

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
        <div className="form-title">修改紀錄</div>
        <Formik
          enableReinitialize
          initialValues={{
            shareNumber: Number(updateFormData?.shareNumber) || 0,
          }}
          validationSchema={Yup.object().shape({
            shareNumber: Yup.number()
              .required("必填")
              .min(1, "請輸入大於0的數字"),
          })}
          onSubmit={async (values, actions) => {
            try {
              await updateStockSellRecord({
                id: (updateFormData as UpdateStockSellRecord).id,
                data: values as UpdateStockSellRecord,
              }).unwrap();
              actions.resetForm();
              showState.setShow(false);
              window.alert("修改成功");
            } catch (err) {
              window.alert("伺服器錯誤，請稍後再試");
            }
          }}
        >
          {(props) => (
            <Form>
              <div className="form-InputBar">
                <label className="form-label">股數</label>
                <Field as="input" className="form-input" name="shareNumber" />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="shareNumber"
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
