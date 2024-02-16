import { useEffect, useState } from 'react';
import { ErrorMessage, Form, Field, Formik } from "formik";
import * as Yup from "yup";
import { useAddRecordMutation, useGetCategoryQuery, useModifyIncExpRecordMutation } from '../../../features/IncExp/IncExpApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';
import { useGetBankQuery } from '../../../features/Bank/BankApiSlice';

// userCurrency{
//     data
//     isSuccess
// }

// category{
//     data
//     isSuccess
// }

const RecordForm = ({showState, currency, userCurrency, category, bank, mode='new', formData}) => {
    const user_id = useSelector(selectCurrentUserId);    
    const [ type, setType ] = useState();
    const [ method, setMethod ] = useState();
    const [ bankCurrency, setBankCurrency ] = useState(null); // this is to indicate the currency of selected bank

    const [ addRecord ] = useAddRecordMutation();
    const [ modifyIncExpRecord ] = useModifyIncExpRecordMutation();
    
    const phraseMap = {
        currency:{
            TWD: "台幣"
        }
    };

    const onClick = () => showState.setShow(!showState.isShow);

    let bankContent, currencyContent, IncCatContent, ExpCatContent;
    let catOptions = [], bankOption = [];
    if(userCurrency.isSuccess && category.isSuccess && bank.isSuccess){
        currencyContent = userCurrency.data.map((item, index) => {
            phraseMap['currency'][item.code] = item.name;
            return <option key={index} value={item.code}>{item.name}</option> ;
        })
        bankContent = bank.data.map((item, index) => {bankOption.push(item.bank_id); return <option key={index} value={item.bank_id}>{item.name}</option>});
        IncCatContent = category.data.IncomeCategoryData.map((item, index) =>{catOptions.push(item.value); return <option key={index} value={item.value}>{item.name}</option>});
        ExpCatContent = category.data.ExpenditureCategoryData.map((item, index) =>{catOptions.push(item.value); return <option key={index} value={item.value}>{item.name}</option>});
    }
    
    useEffect(() =>{
        setType(formData?.type ?? "");
        setMethod(formData?.method ?? "");
        if(bank.isSuccess){
            const index = bank.data.findIndex(item => item.bank_id === formData?.bank_id);
            if(index !== -1)
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
                <div className='form-title'>{mode === "new" ? "新增紀錄" : "修改紀錄"}</div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        type:mode === 'new' ? "default" : formData?.type ?? "",
                        date:mode === 'new' ? new Date().toISOString().split('T')[0] : formData?.date ?? "",
                        category:mode === 'new' ? "default" : formData?.category ?? "",
                        currency:mode === 'new' ? currency ?? "TWD" : formData?.currency ?? "",
                        amount:mode === 'new' ? 0 : formData?.amount ?? 0,
                        method:mode === 'new' ? "default" : formData?.method ?? "",
                        bank:mode === 'new' ? "default" : formData?.bank ?? "",
                        charge:mode === 'new' ? 0 : formData?.charge ?? 0,
                        note:mode === 'new' ? "" : formData?.note ?? ""
                    }}
                    validationSchema={Yup.object().shape({
                        type:Yup.string()
                        .oneOf(["income", "expenditure"], "請選擇類別"),
                        amount: Yup.number()
                        .required("請填入金額")
                        .typeError("只能填入數字")
                        .min(0, "請填入大於零的數字")
                        .max(2000000000, "數值過大"),
                        category:Yup.string()
                        .oneOf(catOptions, "請選擇種類"),
                        method:Yup.string()
                        .oneOf(["cash", "finance", "credit"], "請選擇方式"),
                        bank:Yup.string()
                        .when("method",{
                            is: (method) => (method === "finance" || method === "credit"),
                            then: () => Yup.string().oneOf(bankOption, "請選擇金融機構")
                        }),
                        charge:Yup.number()
                        .when("method",{
                            is: (method) => (method === "finance" || method === "credit"),
                            then: () => Yup.number().required("請填入手續費或0").min(0, "不能小於0").max(2000000000, "數值過大")
                        })
                        
                    })}
                    onSubmit={async (values, actions) => {
                        showState.setShow(!showState.isShow);
                        let result;
                        if(mode === 'new')
                            result = await addRecord({user_id, bankCurrency, ...values}).unwrap();
                        else if(mode === 'modify')
                            result = await modifyIncExpRecord({ID: formData.ID, user_id, bankCurrency, ...values})
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
                                <label className='form-label'>金額</label>
                                <Field className="form-input" name="amount" />
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='amount' component="div"/>

                            <div className='form-InputBar'>
                                <label  className='form-label'>收支方式</label>
                                <Field as='select' className='form-select' name='method' 
                                    onChange={(e) =>{
                                        props.handleChange(e); 
                                        setMethod(e.target.value);
                                        if(e.target.value !== 'cash')
                                            setBankCurrency();
                                        props.setFieldValue('bank', 'default')
                                    }} 
                                >
                                    <option disabled value='default'> -- 請選擇 -- </option>
                                    <option value='cash'>現金交易</option>
                                    <option value='finance'>金融交易</option>
                                    <option value='credit'>信用卡</option>
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='method' component="div"/>

                            {method === 'finance' || method === 'credit' ? //　This is part will appear when the method financial is selected
                                <>
                                    <div className="form-InputBar">
                                        <label className="form-label" >金融機構</label>
                                        <Field as='select' className="form-select" name="bank" onChange={(e) => {
                                            props.handleChange(e);
                                            const index = bank.data.findIndex(item => item.bank_id === e.target.value);
                                            setBankCurrency(bank.data[index].currency);
                                        }}>
                                            <option disabled value="default"> -- 請選擇 -- </option>
                                            { bankContent }
                                        </Field>
                                    </div>
                                    <div className="-my-2 text-center text-xl">幣別:<span className='font-bold text-xl text-rose-600'>{phraseMap['currency'][bankCurrency]}</span></div>
                                    <ErrorMessage className="form-ErrorMessage" name='bank' component="div"/>
                                    <div className='form-InputBar'>
                                        <label  className='form-label'>手續費</label>
                                        <Field  className="form-input" name='charge'/>
                                    </div>
                                    <ErrorMessage className="form-ErrorMessage" name='charge' component="div"/>
                                </> : ""
                            }

                            {
                                method !== 'finance' && method !== 'credit' ?
                                <div className='form-InputBar'>
                                    <label  className='form-label'>幣別</label>
                                    <Field as='select' className='form-select' name='currency' >
                                        <option disabled value='default'> -- 請選擇 -- </option>
                                        <option value='TWD'>台幣</option>
                                        {currencyContent}
                                    </Field>
                                </div> : ""
                            }
                            <div className='form-InputBar'>
                                <label className='form-label'>備註</label>
                                <Field as='textarea' className="form-input note" name="note" type="text" />
                            </div>
                            <div className='form-btn'>
                                <button className='bg-slate-300 enabled:hover:bg-slate-500 border-2 border-black rounded-full disabled:opacity-25' disabled={!props.dirty || !props.isValid}  type='submit' >提交</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default RecordForm;