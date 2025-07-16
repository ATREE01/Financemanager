import {
  CreateStockSplit,
  ShowState,
} from "@financemanager/financemanager-website-types";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import LoadingPage from "@/app/components/loading-page";
import {
  useCreateStockSplitMutation,
  useGetUserStocksQuery,
} from "@/lib/features/stock/StockApiSlice";

export default function StockSplitForm({
  showState,
}: {
  showState: ShowState;
}) {
  const onClick = () => showState.setShow(!showState.isShow);
  const { data: userStocks, isLoading: userStocksIsLoading } =
    useGetUserStocksQuery();
  const [createStockSplit] = useCreateStockSplitMutation();

  if (!userStocks || userStocksIsLoading) return <LoadingPage />;

  const stockOptions = userStocks.map((userStock) => (
    <option key={userStock.id} value={userStock.id}>
      {userStock.name}
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
        <div className="form-title">股票分割</div>
        <Formik
          initialValues={{
            userStockId: "default",
            splitRatio: 1,
          }}
          validationSchema={Yup.object().shape({
            userStockId: Yup.string().oneOf(
              stockOptions.map((option) => option.props.value),
              "請選擇一個有效的股票",
            ),
            splitRatio: Yup.number()
              .min(1, "分割比例必須大於等於 1")
              .required("請輸入分割比例"),
          })}
          onSubmit={async (values, actions) => {
            const body = {
              userStockId: values.userStockId,
              splitRatio: values.splitRatio,
            } as CreateStockSplit;

            const ok = window.confirm(
              "確定要新增股票分割嗎？ 這個動作無法撤銷。",
            );
            if (!ok) return;

            try {
              await createStockSplit(body).unwrap();
              window.alert("新增成功");
              actions.resetForm();
              showState.setShow(false);
            } catch {
              window.alert("新增失敗，請確認輸入資料或稍後再試。");
            }
          }}
        >
          {(props) => (
            <Form>
              <div className="form-InputBar">
                <label className="form-label">分割股票 </label>
                <Field as="select" className="form-select" name="userStockId">
                  <option value="default" disabled>
                    -- 請選擇 --
                  </option>
                  {stockOptions}
                </Field>
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="userStockId"
                component="div"
              />
              <div className="form-InputBar">
                <label className="form-label">分割比例</label>
                <Field
                  as="input"
                  className="form-input"
                  name="splitRatio"
                  type="number"
                  placeholder="分割比例 (例如: 2)"
                />
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="splitRatio"
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
