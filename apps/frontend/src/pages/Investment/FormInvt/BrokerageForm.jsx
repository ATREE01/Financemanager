import { useSelector } from 'react-redux';
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';
import { useAddBrokerageMutation } from '../../../features/Invt/InvtApiSlice';
import { useState } from 'react';

const BrokerageForm = ({showState, userCurrency}) => {

    const user_id = useSelector(selectCurrentUserId);
    const [ addBrokerage ] = useAddBrokerageMutation();
    const [ selectedTranCur, setSelectedTranCur ] = useState({value: 'TWD'});

    let currencyContent;
    let currencyOptions = [ "TWD" ];
    if(userCurrency.isSuccess){
        currencyContent = userCurrency.data.map((item, index) =>    {
            currencyOptions.push(item.code);
            return <option key={index} value={item.code}>{item.name}</option>
        })   
    }

    return (
        <>
            {showState.isShow ? <div className="form-scrim" onClick={() => showState.setShow(!showState.isShow)}></div> : ""}
            <div className={`form-container ${showState.isShow ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={() => showState.setShow(!showState.isShow)}></i>
                </div>
                <div className='form-title'>新增券商</div>
                <Formik
                    initialValues={{
                        name:"",
                        transactionCur: "default",
                        settlementCur: "default"
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string()
                        .required("請輸入名稱")
                        .max(16, "長度最長為16個字"),
                        transanctionCur: Yup.string()
                        .oneOf(currencyOptions, "請選擇交易幣別"),
                        settlementCur: Yup.string()
                        .oneOf(["TWD", selectedTranCur.value], "請選擇交割幣別"),
                    })}
                    onSubmit={async (values, actions) => {
                        const result = await addBrokerage({user_id, ...values}).unwrap();
                        if(result.success === 1){
                            showState.setShow(!showState.setShow);
                            actions.resetForm();
                            window.alert("新增成功"); 
                        }
                        else {
                            console.log(result);
                            if(result.errno === 1062){
                                window.alert("已有相同的銀行名稱");
                            }
                        }
                    }}
                >
                    {props => (
                        <Form>
                            <div className='form-InputBar'>
                                <label className='form-label'>名稱 </label>
                                <Field className="form-input" name='name'/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='name' component="div"/>

                            <div className='form-InputBar'>
                                <label className='form-label'>交易幣別 </label>
                                <Field className="form-input" name='transactionCur' as='select'onChange={(e) => {
                                    props.handleChange(e);
                                    setSelectedTranCur({value: e.target.value, text: e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text});
                                }}>
                                    <option value='default' disabled>-- 請選擇 --</option>
                                    <option value='TWD'>台幣</option>
                                    { currencyContent }
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='transactionCur' component="div"/>

                            <div className='form-InputBar'>
                                <label className='form-label'>交割幣別 </label>
                                <Field className="form-input" name='settlementCur' as='select'>
                                    <option value='default' disabled>-- 請選擇 --</option>
                                    <option value='TWD'>台幣</option>
                                    { selectedTranCur.value !== 'TWD' ?
                                        <option value={selectedTranCur.value}>{selectedTranCur.text}</option> : ""
                                    }
                                </Field>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='settlementCur' component="div"/>

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

export default BrokerageForm;