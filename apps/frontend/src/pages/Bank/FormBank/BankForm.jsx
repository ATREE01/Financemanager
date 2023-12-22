import "../../../assets/form.css";
    
import { ErrorMessage, Form, Field, Formik } from "formik";
import * as Yup from "yup";

import { useAddBankMutation } from '../../../features/Bank/BankApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';

const BankForm = ({showState, onClick}) => {
    
    const [addBank] = useAddBankMutation();

    const user_id = useSelector(selectCurrentUserId);
    
    return (
        <>
            {showState.showBankForm ? <div className="form-scrim" onClick={onClick}></div> : ""}
            <div className={`form-container ${showState.showBankForm ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={onClick}></i>
                </div>
                <div className='form-title'>新增帳戶</div>
                <Formik
                    initialValues={{
                        name:"",
                        initialAmount:''
                    }}
                    validationSchema={Yup.object().shape({
                        name:Yup.string()
                        .required("請輸入名稱")
                        .max(16, "長度最長為16個字"),
                        initialAmount:Yup.number()
                        .typeError("必須是數字")
                        .required("請輸入初始金額")
                        .min(0, "不能小於0")
                        .max(9007199254740991,"不能大於9007199254740991")
                    })}
                    onSubmit={async (values, actions) => {
                        const result = await addBank({user_id, ...values}).unwrap();
                        if(result.success === 1){
                            showState.setShowBankForm(!showState.showBankForm);
                            actions.resetForm();
                            window.alert("新增成功"); 
                        }
                        else {
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
                                <label className='form-label'>初始金額 </label>
                                <Field className="form-input" name='initialAmount'/>
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='initialAmount' component="div"/>
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

export default BankForm;