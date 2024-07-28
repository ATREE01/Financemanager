import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";

import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { useAddDividendRecordMutation, useModifyDividendRecordMutation } from "../../../features/Invt/InvtApiSlice";

// stkList, bank {
//     data
//     isSuccess
// }

const DividendForm = ({showState, bank,  userCurrency, brokerage, stkList, mode='new', formData}) => {

    const user_id = useSelector(selectCurrentUserId);
    
    const [ bankCurrency, setBankCurrency ] = useState("");

    const [ addDividendRecord ] = useAddDividendRecordMutation();
    const [ modifyDividendRecord ] = useModifyDividendRecordMutation();

    const onClick = () => showState.setShow(!showState.isShow)

    const phraseMap = {
        currency: {
            TWD: "台幣"
        }
    }

    let stkContent, bankContent, brkgContent;
    let stkOption = [], bankOption = [], brkgOption = [];
    if(stkList.isSuccess && bank.isSuccess && userCurrency.isSuccess && brokerage.isSuccess){
        userCurrency.data.forEach(element => phraseMap['currency'][element.code] = element.name);
        stkContent = stkList.data.map((item, index) => { 
            stkOption.push(item.stock_symbol); return <option key={index} value={item.stock_symbol}>{item.stock_name}</option>
        })
        brkgContent = brokerage.data.map((item, index) => {
            brkgOption.push(item.brokerage_id); return <option key={index} value={item.brokerage_id}>{item.name}</option>
        })
        bankContent = bank.data.map((item, index) => {
            bankOption.push(item.bank_id); return <option key={index} value={item.bank_id}>{item.name}</option>
        })
    }

    useEffect(() => {
        if(bank.isSuccess){
            const index = bank.data.findIndex(item => item.bank_id === formData?.bank_id);
            if(index != -1)
            setBankCurrency(bank.data[index].currency);
        }
    }, [formData])

    return (
        <>
            {showState.isShow ? <div className="form-scrim" onClick={onClick}></div> : ""}
            <div className={`form-container ${showState.isShow ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={onClick}></i>
                </div>
                <div className='form-title'>股息紀錄</div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        date: mode === "new" ? new Date().toISOString().split('T')[0] : formData?.date ?? '',
                        brokerage: mode === 'new' ? 'default' : formData?.brokerage_id ?? "",
                        stock_symbol : mode === 'new' ? "default" : formData?.stock_symbol ?? "" ,
                        bank: mode === 'new' ? "default" : formData?.bank_id ?? "",
                        amount: mode === 'new' ? 0 : formData?.amount ?? ""
                    }}
                    validationSchema={Yup.object().shape({
                        brokerage: Yup.string()
                        .oneOf(brkgOption, "請選擇券商"),
                        stock_symbol: Yup.string()
                        .oneOf(stkOption, "請選擇股票"),
                        bank: Yup.string()
                        .notOneOf(bankOption, "請選擇金融機構"),
                        amount: Yup.number()
                        .required("請填入金額")
                        .typeError("請填入數字")
                        .moreThan(0, "數值需大於0")
                    })}
                    onSubmit={async (values, actions) => {
                        if(mode === 'new')
                            var result = await addDividendRecord({user_id, bankCurrency, ...values}).unwrap();
                        else if(mode === 'modify')
                            var result = await modifyDividendRecord({ID: formData.ID, user_id, bankCurrency, ...values}).unwrap();
                        if(result.success === 1){
                            showState.setShow(!showState.setShow);
                            actions.resetForm();
                            if(mode === 'new') window.alert("新增成功"); else window.alert("修改成功");
                        }
                        else {
                            window.alert("發生不明錯誤，請通知管理員修理");
                        }
                    }}
                >
                    {props => (
                        <Form>
                            <div className='form-InputBar'>
                                <label className='form-label'>日期</label>
                                <Field className='form-input' name='date' type='date' />
                            </div>

                            <div className="form-InputBar">
                                <label className="form-label">券商</label>
                                <Field className="form-input" name="brokerage" as="select">
                                    <option value="default" disabled>-- 請選擇 --</option>
                                    { brkgContent } 
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='stock_symbol' component="div"/>

                            <div className="form-InputBar">
                                <label className="form-label">股票</label>
                                <Field className="form-input" name="stock_symbol" as="select">
                                    <option value="default" disabled>-- 請選擇 --</option>
                                    { stkContent } 
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='stock_symbol' component="div"/>

                            <div className="form-InputBar">
                                <label className="form-label">金融機構</label>
                                <Field as='select' className="form-select" name="bank" onChange={(e) => {
                                    props.handleChange(e);
                                    const index = bank.data.findIndex(item => item.bank_id === e.target.value);
                                    setBankCurrency(bank.data[index].currency);
                                }}>
                                    <option value="default" disabled>-- 請選擇 --</option>
                                    { bankContent }
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='bank' component="div"/>
                            <div className="-my-2 text-center text-xl">所選銀行幣別:<span className='font-bold text-xl text-rose-600'>{phraseMap['currency'][bankCurrency]}</span></div>

                            <div className="form-InputBar">
                                <label className="form-label">金額</label>
                                <Field className="form-input" name="amount" />
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='amount' component="div"/>

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

export default DividendForm;