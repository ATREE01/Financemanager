import { Formik, Form, Field, ErrorMessage  } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useAddCurTRRecordMutation, useModifyCurTRRecordMutation } from "../../../features/Currency/CurrencyApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
const TransactionRecord = ({showState, userCurrency, bank, mode="new", formData}) => {
    const user_id = useSelector(selectCurrentUserId);

    const [ buyCurrency, setBuyCurrency] = useState("");
    const [ sellCurrency, setSellCurrency] = useState("");
    const phraseMap = {
        currency:{
            TWD: "台幣"
        }
    };
    let bankContent;
    let bankOption = [];  // use for input validation
    if(bank.isSuccess && userCurrency.isSuccess){
        userCurrency.data.forEach( element => phraseMap["currency"][element.code] = element.name);
        bankContent = bank.data.map((item, index) => { bankOption.push(item.bank_id); return <option key={index} value={item.bank_id}>{item.name}</option>})
    }
    const [ addCurTRRecord ] = useAddCurTRRecordMutation();
    const [ modifyCurTRRecord ] = useModifyCurTRRecordMutation();

    useEffect(() => {
        if(bank.isSuccess){
            const index1 = bank.data.findIndex(item => item.bank_id === formData?.buy_bank_id);
            if(index1 != -1)
                setBuyCurrency(bank.data[index1].currency);
            const index2 = bank.data.findIndex(item => item.bank_id === formData?.sell_bank_id);
                if(index1 != -1)
                    setSellCurrency(bank.data[index2].currency);
        }
    }, [formData])
    
    const onClick = () => showState.setShow(!showState.isShow);
    return (
        <>
            {showState.isShow ? <div className="form-scrim" onClick={onClick}></div> : ""}
            <div className={`form-container ${showState.isShow ? "activate" : ""}`}>
                <div className="close-btn">
                    <i className="bi bi-x-circle-fill" onClick={onClick}></i>
                </div>
                <div className="form-title">{mode === "new" ? "新增紀錄" : "修改紀錄"}</div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        date: mode === "new" ? new Date().toISOString().split("T")[0] : formData?.date ?? "",
                        buyBank: mode === "new" ?  "default" : formData?.buy_bank_id ?? "",
                        sellBank: mode === "new" ?  "default" : formData?.sell_bank_id ?? "",
                        buyAmount: mode === "new" ? 0 : formData?.buy_amount ?? "",
                        sellAmount: mode === "new" ? 0 : formData?.sell_amount ?? "",
                        exchangeRate: mode === 'new' ? 0 : formData?.ExchangeRate ?? "",
                        charge: mode === "new" ? 0 : formData?.charge ?? ""
                    }}
                    validationSchema={Yup.object().shape({
                        buyBank: Yup.string()
                        .oneOf(bankOption, "請選擇機構"),
                        sellBank: Yup.string()
                        .oneOf(bankOption, "請選擇機構"),
                        buyAmount: Yup.number()
                        .typeError("請輸入數字")
                        .required("請輸入金額")
                        .min(0, "不能小於0")
                        .max(2000000000, "數值過大"),
                        sellAmount: Yup.number()
                        .typeError("請輸入數字")
                        .required("請輸入金額")
                        .min(0, "不能小於0")
                        .max(2000000000, "數值過大"),
                        exchangeRate: Yup.number()
                        .typeError("請輸入數字")
                        .required("請輸入匯率")
                        .min(0, "不能小於0")
                        .max(2000000000, "數值過大"),
                        charge: Yup.number()
                        .typeError("請輸入數字")
                        .required("請輸入金額")
                        .min(0, "不能小於玲0")
                        .max(2000000000, "數值過大")
                    })}
                    onSubmit={async (values, actions) => {
                        let result;
                        if(mode === "new"){
                            result = await addCurTRRecord({ user_id, ...values}).unwrap();
                        }
                        else if(mode === "modify"){
                            result = await modifyCurTRRecord({ ID: formData.ID, ...values }).unwrap();
                        }
                        if(result.success === 1){
                            showState.setShow(!showState.isShow);
                            actions.resetForm();
                            window.alert(`${mode === "new" ? "新增" : "修改"}成功`); 
                        }
                        else {
                            window.alert("發生未知錯誤，請通知管理人員。");
                        }
                    }}
                >
                    {props => (
                        <Form>
                            <div className="form-InputBar">
                                <label  className="form-label">日期</label>
                                <Field className="form-input" name="date" type="date" />
                            </div>
                            <div className="form-InputBar">
                                <label className="form-label" >入金機構</label>
                                <Field as="select" className="form-select" name="buyBank" onChange={(e) => {
                                    props.handleChange(e);
                                    const index = bank.data.findIndex(item => item.bank_id === e.target.value);
                                    setBuyCurrency(bank.data[index].currency);
                                }}>
                                    <option disabled value="default"> -- 請選擇 -- </option>
                                    { bankContent }
                                </Field>
                            </div>
                            <div className="-my-2 text-center text-xl">幣別:<span className="font-bold text-xl text-rose-600">{phraseMap["currency"][buyCurrency]}</span></div>
                            <ErrorMessage className="form-ErrorMessage" name="buyBank" component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label" >出金機構</label>
                                <Field as="select" className="form-select" name="sellBank" onChange={(e) => {
                                    props.handleChange(e);
                                    const index = bank.data.findIndex(item => item.bank_id === e.target.value);
                                    setSellCurrency(bank.data[index].currency);
                                }}>
                                    <option disabled value="default"> -- 請選擇 -- </option>
                                    { bankContent }
                                </Field>
                            </div>
                            <div className="-my-2 text-center text-xl">幣別:<span className="font-bold text-xl text-rose-600">{phraseMap["currency"][sellCurrency]}</span></div>
                            <ErrorMessage className="form-ErrorMessage" name="sellBank" component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label">入金金額</label>
                                <Field className="form-input" name="buyAmount"/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name="buyAmount" component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label">出金金額</label>
                                <Field className="form-input" name="sellAmount"/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name="sellAmount" component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label">匯率</label>
                                <Field className="form-input" name="exchangeRate"/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name="exchangeRate" component="div"/>
                            <div className="form-InputBar">
                                <label className="form-label">手續費</label>
                                <Field className="form-input" name="charge"/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name="charge" component="div"/>
                            <div className="form-btn">
                                <button  className="bg-slate-300 enabled:hover:bg-slate-500 border-2 border-black rounded-full disabled:opacity-25" disabled={!props.dirty || !props.isValid}  type="submit" >提交</button>
                            </div>
                        </Form>

                    )}
                </Formik>
            </div>
        </>
    )
}

export default TransactionRecord;