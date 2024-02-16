import { useEffect, useState } from "react";
import { ErrorMessage, Form, Field, Formik } from "formik";
import * as Yup from "yup";
import { useAddBankRecordMutation, useGetBankQuery } from "../../../features/Bank/BankApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import { useModifyBankRecordMutation } from "../../../features/Bank/BankApiSlice";

// bank{
//     data
//     isSuccess
// }

const BankRecordForm = ({showState, userCurrency, bank, mode='new', formData}) =>{

    const [ currency, setCurrency ] = useState(""); //TODO: when mode equals to modify need to set this value
    const user_id = useSelector(selectCurrentUserId);
    const [ addBankRecord ] = useAddBankRecordMutation();
    const [ modifyBankRecord ] = useModifyBankRecordMutation();

    const phraseMap = {
        currency:{
            TWD: "台幣"
        }
    };

    let bankContent;
    let bankOption = [];  // use for input validation
    if(bank.isSuccess && userCurrency.isSuccess){
        userCurrency.data.forEach( element => phraseMap['currency'][element.code] = element.name);
        bankContent = bank.data.map((item, index) => { bankOption.push(item.bank_id); return <option key={index} value={item.bank_id}>{item.name}</option>})
    }
    
    const onClick = () => showState.setShow(!showState.isShow)

    useEffect(() => {
        if(bank.isSuccess){
            const index = bank.data.findIndex(item => item.bank_id === formData?.bank_id);
            if(index != -1)
                setCurrency(bank.data[index].currency);
        }
    }, [formData])

    return (
        <>
            {showState.isShow ? <div className="form-scrim" onClick={onClick}></div> : ""}
            <div className={`form-container ${showState.isShow ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={onClick}></i>
                </div>
                <div className='form-title'>{mode === 'new' ? "新增紀錄" : "修改紀錄"}</div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        type: mode === 'new' ? "default" : formData?.type ?? "",
                        date: mode === 'new' ? new Date().toISOString().split('T')[0] : formData?.date ?? "",
                        bank: mode === 'new' ? "default" : formData?.bank_id ?? "",
                        amount: mode === 'new' ? 0 : formData?.amount ?? "",
                        charge: mode === 'new' ? 0  : formData?.charge ?? ""
                    }}
                    validationSchema={Yup.object().shape({
                        type:Yup.string()
                        .oneOf(["deposit", "withdraw", "transfer_in", "transfer_out"], "請選擇類別"),
                        bank:Yup.string()
                        .oneOf(bankOption, "請選擇金融機構"),
                        amount:Yup.number()
                        .typeError("必須是數字")
                        .required("請填入金額")
                        .min(0, "不能小於0")
                        .max(9000000000000000,"數值過大"),
                        charge: Yup.number()
                        .typeError("必須是數字")
                        .required("請須填入手續費或零")
                        .min(0, "不能小於零")
                        .max(2000000000, "數值過大")
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
                            showState.setShow(!showState.isShow);
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
                                    const index = bank.data.findIndex(item => item.bank_id === e.target.value);
                                    setCurrency(bank.data[index].currency);
                                }}>
                                    <option disabled value="default"> -- 請選擇 -- </option>
                                    { bankContent }
                                </Field>
                            </div>
                            <div className="-my-2 text-center text-xl">幣別:<span className='font-bold text-xl text-rose-600'>{phraseMap['currency'][currency]}</span></div>
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
                                <button  className="bg-slate-300 enabled:hover:bg-slate-500 border-2 border-black rounded-full disabled:opacity-25" disabled={!props.dirty || !props.isValid}  type='submit' >提交</button>
                            </div>
                        </Form>

                    )}
                </Formik>
            </div>
        </>
    )
}

export default BankRecordForm;