import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { useGetBankQuery } from "../../../features/Bank/BankApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import { useEffect, useState } from "react";
import { useAddStockRecordMutation, useGetStockQuery, useModifyStockRecordMutation } from "../../../features/Invt/InvtApiSlice";


// bank {
//     data,
//     isSuccess
// }

const StockRecordForm = ({showState, bank, brokerage, userCurrency, stkList, action="buy", mode="new", formData}) => {
    
    const [ selectedBrokerage, setSelectedBrokerage ] = useState(null);
    const [ selectedBankCurrency, setSelectedBankCurrency ] = useState(""); // this is to indicate the currency of selected bank

    const phraseMap = {
        currency:{
            TWD: "台幣"
        }
    };

    const brokerageData = {};

    const user_id = useSelector(selectCurrentUserId)
    const [ addStockRecord ] = useAddStockRecordMutation();
    const [ modiftyStockRecord ] = useModifyStockRecordMutation();

    let brkgContent, stkContent;
    let bankOption = [], brkgOption = [], stkOption = [];
    if(userCurrency.isSuccess && brokerage.isSuccess && stkList.isSuccess && bank.isSuccess){
        userCurrency.data.forEach( element => phraseMap['currency'][element.code] = element.name);
        brkgContent = brokerage.data.map((item, index) => {
            brokerageData[item.brokerage_id] = {
                transactionCur: item.transactionCur,
                settlementCur: item.settlementCur
            }
            brkgOption.push(item.brokerage_id);
            return <option key={index} value={item.brokerage_id}>{item.name}</option>
        })
        stkContent = stkList.data.map((item, index) =>{
            stkOption.push(item.stock_symbol);
            return <option key={index} value={item.stock_symbol}>{item.stock_name}</option>
        })
        bank.data.forEach(element => bankOption.push(element.bank_id));
    }

    useEffect(() => {
        setSelectedBrokerage(formData?.brokerage_id ?? null)
        if(bank.isSuccess){
            const index = bank.data.findIndex(item => item.bank_id === formData?.bank_id);
            if(index != -1)
                setSelectedBankCurrency(bank.data[index].currency);
        }
    }, [formData])
    return (
        <>
            {showState.isShow ? <div className="form-scrim" onClick={() => showState.setShow(!showState.isShow)}></div> : ""}
            <div className={`form-container ${showState.isShow ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={() => showState.setShow(!showState.isShow)}></i>
                </div>
                <div className='form-title'>{mode === "new" ? (action === "buy" ? "新增買入紀錄" : "新增賣出紀錄") : "修改紀錄"}</div>
                <Formik
                    enableReinitialize
                    initialValues={{
                        brokerage: mode === "new" && action === "buy" ? "default" : formData?.brokerage_id ?? "",
                        date: mode === "new" ? new Date().toISOString().split('T')[0] : formData?.date,
                        type: mode === "new" ? (action === "buy" ? "default" : undefined) : formData?.type ?? 0,
                        bank: mode === "new" && action === "buy" ? "default" : formData?.bank_id ?? 0,
                        total: mode === "new" ? 0 : formData?.total, 
                        stock_symbol: mode === "new" && action === "buy" ? "default" : formData?.stock_symbol ?? '',
                        buy_stock_price: mode === "new" && action === "buy" ? 0 : formData?.buy_stock_price ?? 0,
                        sell_stock_price: mode === "new" ? (action === "buy" ? undefined : 0) : formData?.sell_stock_price ?? 0,
                        share_number: mode === "new" ? (action === "buy" ? 0 : formData?.hold_share_number ?? 0) : formData?.share_number ?? 0,
                        buy_exchange_rate: mode === "new" && action === "buy" ? 1 : formData?.buy_exchange_rate ?? 0,
                        sell_exchange_rate: mode === "new" && action === "sell" ? 1 : undefined,
                        charge:mode === "new" ? (action === 'buy' ? 0 : 0 ) : formData?.charge ?? 0,
                        tax:mode === "new" ? (action === 'buy' ? undefined : 0 ) : formData?.tax ?? 0,
                        note: mode === "new" ? "" : formData?.note ?? 0,
                    }}
                    //    B.brokerage_id, B.stock_symbol, B.total, B.buy_stock_price,
                    validationSchema={Yup.object().shape({ // TODO: change the notOneOf to oneOf to avoid XSS
                        brokerage: Yup.string()
                        .oneOf(brkgOption, "請選擇券商"),
                        type: Yup.string()
                        .when({
                            is: () => (action === 'sell'),
                            then: () => Yup.string()
                            .notOneOf(['default'], "請選擇方法"),
                        }),
                        bank: Yup.string()
                        .oneOf(bankOption, "請選擇付款金融機構"),
                        stock_symbol:Yup.string()
                        .oneOf(stkOption, "請選擇股票"),

                        total: Yup.number()
                        .required("請輸入總金額")
                        .typeError("請輸入數字")
                        .moreThan(0, "數值必須大於零")
                        .max(200000000, "數值過大"),

                        buy_stock_price: Yup.number()
                        .required("請填入買入股價")
                        .typeError("請輸入數字")
                        .moreThan(0, "數值必須大於零")
                        .max(200000000, "數值過大"),

                        sell_stock_price:Yup.number()
                        .when({
                            is: () => (action === 'sell'),
                            then: () => Yup.number()
                                .required("請填入賣出股價")
                                .typeError("請輸入數字")
                                .moreThan(0, "數值必須大於零")
                                .max(200000001, "數值過大"),
                        }),

                        share_number: Yup.number()
                        .required("請填入股數")
                        .typeError("請輸入數字")
                        .moreThan(0, "數值必須大於零")
                        .max(200000001, "數值過大"),

                        buy_exchange_rate: Yup.number()
                        .when({
                            is: () => (selectedBrokerage !== null && brokerageData[selectedBrokerage].transactionCur !== brokerageData[selectedBrokerage].settlementCur),
                            then: () => Yup.number()
                                .required("請填入匯率")
                                .typeError("請輸入數字")
                                .moreThan(0,"數值必須大於零")
                                .max(10000, "數值過大")
                        }),

                        sell_exchange_rate: Yup.number()
                        .when({
                            is: () => (selectedBrokerage !== null && brokerageData[selectedBrokerage].transactionCur !== brokerageData[selectedBrokerage].settlementCur && action === 'sell'),
                            then: () => Yup.number()
                                .required("請填入匯率")
                                .typeError("請輸入數字")
                                .moreThan(0,"數值必須大於零")
                                .max(10000, "數值過大")
                        }),

                        charge: Yup.number()
                        .required("請填入手續費")
                        .typeError("請輸入數字")
                        .min(0, "數值必須大於零") 
                        .max(200000001, "數值過大"),
                        // .when({
                        //     is: () => (action === 'sell'),
                        //     then: () => Yup.number()
                        // }),

                        tax: Yup.number()
                        .when({
                            is: () => (action === 'sell'),
                            then: () => Yup.number()
                                .required("請填入手續費")
                                .typeError("請輸入數字")
                                .min(0, "數值必須大於零") 
                                .max(200000001, "數值過大"),
                        }),

                        note: Yup.string()
                        .max(200, "請勿超過200個字元")
                    })}
                    onSubmit={async (values, actions) => {
                        let result;
                        if(mode == "new")
                            result = await addStockRecord({user_id, action, selectedBankCurrency, ...values}).unwrap();
                        else if(mode === 'modify') {
                            result = await modiftyStockRecord({ ID:formData.ID, user_id, action, selectedBankCurrency, ...values}).unwrap();
                        }
                        
                        if(result.success === 1){
                            showState.setShow(!showState.setShow);
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
                                <label className='form-label'>日期</label>
                                <Field className='form-input' name='date' type='date' />
                            </div>

                            <div className='form-InputBar'>
                                <label className='form-label'>券商</label>
                                <Field className="form-input" name='brokerage' as='select' onChange={(e) => {
                                    props.handleChange(e); setSelectedBrokerage(e.target.value);
                                }}>
                                    <option value="default" disabled>-- 請選擇 --</option>
                                    { brkgContent }
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='brokerage' component="div"/>
                            <div className="-my-2 text-center text-xl">
                                交易幣別: <span className='font-bold text-xl text-rose-600'>{phraseMap['currency'][brokerageData[selectedBrokerage]?.transactionCur]}  </span>  
                                交割幣別: <span className='font-bold text-xl text-rose-600'>{phraseMap['currency'][brokerageData[selectedBrokerage]?.settlementCur]}</span>
                            </div>
                            {
                                action === 'buy' &&
                                <>
                                    <div className="form-InputBar">
                                        <label className="form-label">買入方法</label>
                                        <Field className='form-select' name="type" as='select'>
                                            <option value="default" disabled>-- 請選擇 --</option>
                                            <option value="manually">手動買入</option>
                                            <option value="regular">定期定額</option>
                                        </Field>
                                    </div>
                                    <ErrorMessage className="form-ErrorMessage" name='type' component="div"/>
                                </> 
                            }
                            <div className="form-InputBar">
                                <label className="form-label" >付款機構</label>
                                <Field as='select' className="form-select" name="bank" onChange={(e) => {
                                    props.handleChange(e);
                                    const index = bank.data.findIndex(item => item.bank_id === e.target.value);
                                    setSelectedBankCurrency(bank.data[index].currency);
                                }}>
                                    <option disabled value="default"> -- 請選擇 -- </option>
                                    {   bank.isSuccess &&
                                        bank.data.map((item, index) => {
                                            if(selectedBrokerage !== null && item.currency === brokerageData[selectedBrokerage].settlementCur){
                                                return <option key={index} value={item.bank_id}>{item.name}</option>
                                            }
                                        })
                                    }
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='bank' component="div"/>
                            <div className="-my-2 text-center text-xl">所選銀行幣別:<span className='font-bold text-xl text-rose-600'>{phraseMap['currency'][selectedBankCurrency]}</span></div>
                            
                            <div className="form-InputBar">
                                <label className="form-label">股票</label>
                                <Field className="form-input" name="stock_symbol" as='select'>
                                    <option disabled value="default"> -- 請選擇 -- </option>
                                    { stkContent }
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='stock_symbol' component="div"/>

                            <div className="form-InputBar">
                                <label className="form-label">總金額</label>
                                <Field className="form-input" name="total"/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='total' component="div"/>
                            <div className="-my-2 text-center text-xl"><span className='font-bold text-xl text-rose-600'>買入:股價 * 股數 + 手續費<br/>賣出:股價*股數 - 手續費 - 稅金</span></div>

                            {   
                                action === 'sell' ?
                                <>
                                    <div className="form-InputBar">
                                        <label className="form-label">賣出股價</label>
                                        <Field className="form-input" name="sell_stock_price" />
                                    </div>
                                    <ErrorMessage className="form-ErrorMessage" name='sell_stock_price' component="div"/> 
                                </> : ""
                            }

                            <div className="form-InputBar">
                                <label className="form-label">{ action === 'buy' ? "買入股價" : "元買入股價"}</label>
                                <Field className="form-input disabled:brightness-75" name="buy_stock_price" disabled={action === 'sell'} />
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='buy_stock_price' component="div"/>

                            <div className="form-InputBar">
                                <label className="form-label">股數</label>
                                <Field className="form-input" name="share_number" />
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='share_number' component="div"/>

                            {
                                selectedBrokerage !== null && brokerageData[selectedBrokerage].transactionCur !== brokerageData[selectedBrokerage].settlementCur &&
                                <>
                                    <div className="form-InputBar">
                                        <label className="form-label">{action === 'sell' ? "元" : ""}買入匯率</label>
                                        <Field className="form-input disabled:brightness-75" name="buy_exchange_rate" disabled={action === 'sell'}/>
                                    </div>
                                    <ErrorMessage className="form-ErrorMessage" name='sell_exchange_rate' component="div"/>
                                    {
                                        action === 'sell' &&
                                        <>
                                             <div className="form-InputBar">
                                                <label className="form-label">賣出匯率</label>
                                                <Field className="form-input" name="sell_exchange_rate" />
                                            </div>
                                            <ErrorMessage className="form-ErrorMessage" name='sell_exchange_rate' component="div"/>
                                        </>
                                    }
                                   
                                </> 
                            }

                            <div className="form-InputBar">
                                <label className="form-label">手續費</label>
                                <Field className="form-input" name="charge"/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='charge' component="div"/>

                            { action === 'sell' &&
                                <>
                                    <div className="form-InputBar">
                                        <label className="form-label">稅金</label>
                                        <Field className="form-input" name="tax"/>
                                    </div>
                                    <ErrorMessage className="form-ErrorMessage" name='tax' component="div"/>
                                </> 
                            }

                            <div className='form-InputBar'>
                                <label className='form-label'>備註</label>
                                <Field as='textarea' className="form-input note" name="note" type="text" placeholder="e.g. 定期定額換匯的匯率"/>
                            </div>
                            
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

export default StockRecordForm;

