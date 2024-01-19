import "../../../assets/form.css";
import { useState } from "react";
import { ErrorMessage, Form, Field, Formik } from "formik";
import * as Yup from "yup";
import { useAddBankRecordMutation, useGetBankQuery } from "../../../features/Bank/BankApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import { useModifyBankRecordMutation } from "../../../features/Bank/BankApiSlice";

const BankRecordForm = ({showState, onClick, mode="new", formData, userCurrency}) =>{

    const [ currency, setCurrency ] = useState("");
    const user_id = useSelector(selectCurrentUserId);
    const [ addBankRecord ] = useAddBankRecordMutation();
    const [ modifyBankRecord ] = useModifyBankRecordMutation();

    const {
        data: banks,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({user_id});

    console.log(banks)
    const phraseMap = {
        currency:{
            TWD: "台幣"
        }
    };

    let bankContent;
    if(bankIsSuccess && userCurrency.isSuccess){
        userCurrency.data.forEach( element => phraseMap['currency'][element.code] = element.name);
        bankContent = banks.map((item, index) => <option key={index} value={item.bank_id}>{item.name}</option>)
    }
    
    return (
        <>
            {showState.showRecordForm ? <div className="form-scrim" onClick={onClick}></div> : ""}
            <div className={`form-container ${showState.showRecordForm ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={onClick}></i>
                </div>
                <div className='form-title'>{mode === 'new' ? "新增紀錄" : "修改紀錄"}</div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        type: mode === 'new' ? "default" : formData.type ?? "",
                        date: mode === 'new' ? new Date().toISOString().split('T')[0] : formData.date ?? "",
                        bank: mode === 'new' ? "default" : formData.bank_id ?? "",
                        amount: mode === 'new' ? "" : formData.amount ?? "",
                        charge: mode === 'new' ? 0  : formData.charge ?? 0
                    }}
                    validationSchema={Yup.object().shape({
                        type:Yup.string()
                        .notOneOf(["default"], "請選擇類別"),
                        bank:Yup.string()
                        .notOneOf(["default"], "請選擇金融機構"),
                        amount:Yup.number()
                        .typeError("必須是數字")
                        .required("請填入金額")
                        .min(0, "不能小於0")
                        .max(9007199254740991,"數值過大"),
                        charge: Yup.number()
                        .typeError("必須是數字")
                        .required("請須填入手續費或零")
                        .min(0, "不能小於零")
                        .max(2147483647, "數值過大")
                    })}
                    onSubmit={async (values, actions) => {
                        let result;
                        if(mode === 'new'){
                            result = await addBankRecord({user_id, currency,...values}).unwrap();
                        }
                        else if(mode === 'modify'){
                            result = await modifyBankRecord({ID:formData.ID, user_id, ...values}).unwrap();
                        }
                        if(result.success === 1){
                            showState.setShowRecordForm(!showState.showRecordForm);
                            if(mode === 'new') window.alert("新增成功"); else window.alert("修改成功");
                            actions.resetForm();
                        }
                        else {
                            // console.log(result)
                            window.alert("發生不明錯誤")
                        }
                    }}
                >
                    {props => (
                        <Form>
                            <div className='form-InputBar'>
                                <label className='form-label'>類別 </label>
                                <Field as='select' className='form-select' name='type'>
                                    <option disabled value="default"> -- 請選擇 -- </option>
                                    <option value="deposit">存款</option>
                                    <option value="withdraw">提款</option>
                                    <option value="transfer_in">轉入</option>
                                    <option value="transfer_out">轉出</option>
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='type' component="div"/>
                            <div className='form-InputBar'>
                                <label  className='form-label'>日期</label>
                                <Field className='form-input' name='date' type='date' />
                            </div>
                            <div className="form-InputBar">
                                <label className="form-label" >金融機構</label>
                                <Field as='select' className="form-select" name="bank" onChange={(e) => {
                                    props.handleChange(e);
                                    const index = banks.findIndex(item => item.bank_id === e.target.value);
                                    setCurrency(banks[index].currency);
                                }}>
                                    <option disabled value="default"> -- 請選擇 -- </option>
                                    { bankContent }
                                </Field>
                            </div>
                            <div className="-my-2 text-center font-bold">幣別:{phraseMap['currency'][currency]}</div>
                            <ErrorMessage className="form-ErrorMessage" name='bank' component="div"/>
                            <div className='form-InputBar'>
                                <label className='form-label'>金額 </label>
                                <Field className="form-input" name='amount'/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='amount' component="div"/>
                            <div className='form-InputBar'>
                                <label className='form-label'>手續費 </label>
                                <Field className="form-input" name='charge'/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='charge' component="div"/>
                            <div className='form-btn'>
                                <button  className="bg-slate-300 hover:bg-slate-500 border-2 border-black rounded-full" disabled={!props.dirty || !props.isValid}  type='submit' >提交</button>
                            </div>
                        </Form>

                    )}
                </Formik>
            </div>
        </>
    )
}

export default BankRecordForm;