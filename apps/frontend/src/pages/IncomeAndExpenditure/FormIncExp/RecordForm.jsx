import '../../../assets/form.css';

import { useState } from 'react';
import { ErrorMessage, Form, Field, Formik } from "formik";
import * as Yup from "yup";
import { useAddRecordMutation, useGetCategoryQuery } from '../../../features/IncExp/IncExpApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';
import { useGetBankQuery } from '../../../features/Bank/BankApiSlice';
import { useGetUserCurrencyQuery } from '../../../features/Currency/CurrencyApiSlice';

// userCurrency{
//     data
//     userCurIsSuccess
// }

const RecordForm = ({onClick, showState, currency, userCurrency}) => {
    const user_id = useSelector(selectCurrentUserId);    
    const [ addRecord ] = useAddRecordMutation();
    const [ type, setType ] = useState();
    const [ method, setMethod ] = useState();

    const {
        data:banks,
        isSuccess:accIsSuccess
    } = useGetBankQuery({user_id});

    let BankContent, currencyContent;
    if(accIsSuccess && userCurrency.isSuccess){
        currencyContent = userCurrency.data.map((item, index) => <option key={index} value={item.code}>{item.name}</option> )
        BankContent = banks.map((item, index) => <option key={index} value={item.bank_id}>{item.name}</option>);
    }

    const {
        data: category,
        isSuccess:catIsSuccess
    } = useGetCategoryQuery({user_id});
    let IncCatContent, ExpCatContent;
    if(catIsSuccess){
        IncCatContent = category.IncomeCategoryData.map((item, index) => <option key={index} value={item.value}>{item.name}</option>);
        ExpCatContent = category.ExpenditureCategoryData.map((item, index) => <option key={index} value={item.value}>{item.name}</option>);
    }

    return (
        <>
            {showState.showRecordForm ? <div className="form-scrim" onClick={onClick}></div> : ""}
            <div className={`form-container ${showState.showRecordForm ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={onClick}></i>
                </div>
                <div className='form-title'>新增紀錄</div>
                <Formik
                    initialValues={{
                        type:"default",
                        date:new Date().toISOString().split('T')[0],
                        category:"default",
                        currency:currency,
                        amount:0,
                        method:"default",
                        bank:"default",
                        charge:"",
                        note:""
                    }}
                    validationSchema={Yup.object().shape({
                        type:Yup.string()
                        .notOneOf(["default"], "請選擇類別"),
                        amount: Yup.number()
                        .typeError("只能填入數字")
                        .min(0, "請填入大於零的數字")
                        .max(2000000000, "數值過大")
                        .required("請填入金額"),
                        category:Yup.string()
                        .notOneOf(["default"], "請選擇種類"),
                        method:Yup.string()
                        .notOneOf(["default"], "請選擇方式"),
                        bank:Yup.string()
                        .when("method",{
                            is: (method) => (method === "finance" || method === "credit"),
                            then: () => Yup.string().notOneOf(["default"], "請選擇金融機構")
                        }),
                        charge:Yup.number()
                        .when("method",{
                            is: (method) => (method === "finance" || method === "credit"),
                            then: () => Yup.number().required("請填入手續費或0").min(0, "不能小於0").max(2147483647, "數值過大")
                        })
                        
                    })}
                    onSubmit={async (values, actions) => {
                        showState.setShowRecordForm(!showState.showRecordForm);
                        const result = await addRecord({user_id, ...values}).unwrap();
                        if(result.success === 1){
                            window.alert("新增成功");
                            setMethod('default');
                            actions.resetForm();
                        }
                    }}
                >
                    {props => (
                        <Form>
                            <div className='form-InputBar'>
                                <label className='form-label'>類別 </label>
                                <Field as='select' className='form-select' name='type' onChange={(e) => {props.handleChange(e); props.setFieldValue("category", "default"); setType(e.target.value)}}>
                                    <option disabled value="default"> -- 請選擇 -- </option>
                                    <option value="income">收入</option>
                                    <option value="expenditure">支出</option>
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='type' component="div"/>
                            <div className='form-InputBar'>
                                <label  className='form-label'>日期</label>
                                <Field className='form-input' name='date' type='date' />
                            </div>

                            <div className='form-InputBar'>
                                <label  className='form-label'>種類 </label> 
                                <Field as='select' className='form-select' name='category' >
                                    <option disabled value="default"> -- 請選擇類別 -- </option>
                                    {type === "income" ? IncCatContent : "" }
                                    {type === "expenditure" ? ExpCatContent : ""}
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='category' component="div"/>
                            <div className='form-InputBar'>
                                <label  className='form-label'>幣別</label>
                                <Field as='select' className='form-select' name='currency' >
                                    <option disabled value='default'> -- 請選擇 -- </option>
                                    <option value='TWD'>台幣</option>
                                    {currencyContent}
                                </Field>
                            </div>
                            <div className='form-InputBar'>
                                <label className='form-label'>金額</label>
                                <Field className="form-input" name="amount" />
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='amount' component="div"/>
                            <div className='form-InputBar'>
                                <label  className='form-label'>收支方式</label>
                                <Field as='select' className='form-select' name='method' 
                                    onChange={(e) =>{props.handleChange(e); setMethod(e.target.value)}}
                                >
                                    <option disabled value='default'> -- 請選擇 -- </option>
                                    <option value='cash'>現金交易</option>
                                    <option value='finance'>金融交易</option>
                                    <option value='credit'>信用卡</option>
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='method' component="div"/>
                            {method === 'finance' || method === 'credit' ?  //　This is part will appear when the method financial is selected
                                <>
                                    <div className='form-InputBar'>
                                        <label  className='form-label'>金融機構</label>
                                        <Field as='select' className='form-select'name='bank'>
                                            <option disabled value='default'> -- 請選擇 -- </option>
                                            {method === "finance" ? accBankContent : ""}
                                            {method === "credit" ? crdBankContent : ""}
                                        </Field>
                                    </div>
                                    <ErrorMessage className="form-ErrorMessage" name='bank' component="div"/>
                                    <div className='form-InputBar'>
                                        <label  className='form-label'>手續費</label>
                                        <Field  className="form-input" name='charge'/>
                                    </div>
                                    <ErrorMessage className="form-ErrorMessage" name='charge' component="div"/>
                                </> : ""
                            }
                            <div className='form-InputBar'>
                                <label className='form-label'>備註</label>
                                <Field as='textarea' className="form-input note" name="note" type="text" />
                            </div>
                            <div className='form-btn'>
                                <button  disabled={!props.dirty || !props.isValid}  type='submit' >提交</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default RecordForm;