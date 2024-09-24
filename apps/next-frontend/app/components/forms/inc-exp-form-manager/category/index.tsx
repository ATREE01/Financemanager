import {
  IncExpRecordType,
  ShowState,
} from "@financemanager/financemanager-webiste-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import { useCreateCategoryMutation } from "@/lib/features/Category/CategoryApiSlice";

export default function CategoryForm({ showState }: { showState: ShowState }) {
  // this component can only be used when userId is available so it's always is a string.
  const [createCategory] = useCreateCategoryMutation();

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
        <div className="form-title">新增種類</div>
        <Formik
          initialValues={{
            type: "default",
            name: "",
          }}
          validationSchema={Yup.object().shape({
            type: Yup.string().oneOf(
              [IncExpRecordType.INCOME, IncExpRecordType.EXPENSE],
              "請選擇類別",
            ),
            name: Yup.string()
              .required("請輸入名稱")
              .max(16, "最多只能輸入16個字"),
          })}
          onSubmit={async (values, actions) => {
            try {
              await createCategory({ ...values }).unwrap();
              window.alert("新增成功");
              actions.resetForm();
              showState.setShow(false);
            } catch (err) {
              if ((err as FetchBaseQueryError).status === 409) {
                actions.setFieldError("name", "此名稱已存在");
              }
            }
          }}
        >
          {(props) => (
            <Form>
              <div className="form-InputBar">
                <label className="form-label">類別 </label>
                <Field as="select" className="form-select" name="type">
                  <option disabled value="default">
                    {" "}
                    -- 請選擇 --{" "}
                  </option>
                  <option value={IncExpRecordType.INCOME}>收入</option>
                  <option value={IncExpRecordType.EXPENSE}>支出</option>
                </Field>
              </div>
              <ErrorMessage
                className="form-ErrorMessage"
                name="type"
                component="div"
              />
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
