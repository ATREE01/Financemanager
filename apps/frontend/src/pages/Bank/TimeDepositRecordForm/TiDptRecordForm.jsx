import "../../../assets/form.css";

import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector } from "react-redux";
import { useAddTimeDepositRecordMutation, useModifyTimeDepositRecordMutation } from "../../../features/Bank/BankApiSlice";

const TiDptRecordForm = ({showState, onClick, bank, mode="new", formData}) =>{
    const user_id = useSelector(selectCurrentUserId);
    const [ addTimeDepositRecord ] = useAddTimeDepositRecordMutation();
    const [ modifyTimeDepositRecord ] = useModifyTimeDepositRecordMutation();

    let bankContent, currencyContent;
    if(bank.bankIsSuccess){
        bankContent = bank.banks.map((item, index) => <option key={index} value={item.bank_id}>{item.name}</option>)
    }
    
    return (
        <>
            {showState.showForm ? <div className="form-scrim" onClick={onClick}></div> : ""}
            <div className={`form-container ${showState.showForm ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={onClick}></i>
                </div>
                <div className='form-title'>{mode === 'new' ? "新增定存" : "修改紀錄"}</div>
                <Formik
                    enableReinitialize//  Control whether Formik should reset the form if initialValues changes 
                    initialValues={{
                        bank: mode === 'new' ? "default" : formData.bank_id || "",
                        type: mode ==='new' ? "default" : formData.type || "",
                        currency: mode === 'new' ? "default" : formData.currency || "",
                        amount: mode === 'new' ? "" : formData.amount || "",
                        interest: mode === 'new' ? "" : formData.interest || "",
                        startDate: mode === 'new' ? new Date().toISOString().split('T')[0] : formData.startDate || "",
                        endDate: mode === 'new' ? "" : formData.endDate || "",
                        accInterest: mode === 'new' ? 0 : formData.accInterest ?? 0
                    }}
                    validationSchema={Yup.object().shape({
                        bank:Yup.string()
                        .notOneOf(["default"], "請選擇金融機構"),
                        type:Yup.string()
                        .notOneOf(["default"], "請選擇種類"),
                        currency:Yup.string()
                        .notOneOf(['default'], "請選擇幣別"),
                        amount:Yup.number()
                        .required("請輸入金額")
                        .typeError("只能輸入數字")
                        .min(1, "不能小於1"),
                        interest:Yup.string()
                        .required("請輸入利率")
                        .matches(/^(\d{1,4}(\.\d{1,4})?)%$/, "請確認所輸入的利率格式"),
                        startDate:Yup.date()
                        .required("請選擇開始日期"),
                        endDate:Yup.date()
                        .required("請選結束擇日期")
                        .min(Yup.ref("startDate"), '結束日期不能早於開始日期'),

                    })}
                    onSubmit={async (values, actions) => {
                        let result;
                        if(mode === 'new')
                            result = await addTimeDepositRecord({user_id, ...values}).unwrap();
                        else
                            result = await modifyTimeDepositRecord({ID:formData.ID, user_id, ...values}).unwrap();
                        if(result.success === 1){
                            showState.setShowForm(!showState.showForm);
                            if(mode === 'new') window.alert("新增成功"); else window.alert("修改成功");
                            actions.resetForm();
                        }
                    }}
                >
                    {props => (
                        <Form>
                            <div className='form-InputBar'>
                                <label className='form-label'>金融機構 </label>
                                <Field className="form-select" as='select' name="bank">
                                    <option disabled value="default">--請選擇--</option>
                                    {bankContent}
                                </Field>                                
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='bank' component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label">種類 </label>
                                <Field className="form-select" as="select" name="type">
                                    <option disabled value="default">--請選擇--</option>
                                    <option value="part-deposit-all-withdraw">零存整付</option>
                                    <option value="all-deposit-all-withdraw">整存整付</option>
                                    <option value="all-deposit-part-interest">存本取息</option>
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='type' component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label">幣別</label> {/* other currency should be add with user customize currency */}
                                <Field className="form-select" as="select" name='currency'> 
                                    <option disabled value="default">--- 請選擇 ---</option>
                                    <option value="TWD">台幣</option>
                                    {currencyContent}
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='currency' component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label">金額</label>
                                <Field className="form-input" name='amount'/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='amount' component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label">利率</label>
                                <Field className="form-input" name='interest' placeholder="Ex:1.5%"/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='interest' component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label">開始日期</label>
                                <Field className='form-input' name='startDate' type='date' />
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='startDate' component="div"/>             
                            <div className="form-InputBar">
                                <label className="form-label">結束日期</label>
                                <Field className='form-input' name='endDate' type='date' />
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='endDate' component="div"/>   
                            <div className="form-InputBar">
                                <label className="form-label">累積利息</label>
                                <Field className="form-input" name='accInterest'/>
                            </div>
                            <div className='form-btn'>
                                <button className="bg-slate-300 hover:bg-slate-500 border-2 border-black rounded-full" disabled={!props.dirty || !props.isValid}  type='submit' >提交</button>
                            </div>
                        </Form>

                    )}
                </Formik>
            </div>
        </>
    )
}

export default TiDptRecordForm;