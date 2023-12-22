import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';
import { useAddIncExpCategoryMutation } from "../../../features/IncExp/IncExpApiSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';

import '../../../assets/form.css';

const CategoryForm = ({onClick, showState}) => {
    const user_id = useSelector(selectCurrentUserId);    
    const [ addIncExpCategory ] = useAddIncExpCategoryMutation();
    return (
        <>
            {showState.showCategoryForm ? <div className="form-scrim" onClick={onClick}></div> : ""}
            <div className={`form-container ${showState.showCategoryForm ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={onClick}></i>
                </div>
                <div className='form-title'>新增自訂種類</div>
                <Formik
                    initialValues={{
                        type:"default",
                        name:""
                    }}
                    validationSchema={Yup.object().shape({
                        name:Yup.string()
                        .required("請輸入名稱") 
                        .max(16, "最多只能輸入16個字")
                        .matches(/^[\u4E00-\u9FFF0-9a-zA-Z]{0,16}$/, "請只輸入中文、英文及數字")
                    })}
                    onSubmit={async (values, actions) => {
                        console.log(values);
                        const result = await addIncExpCategory({user_id, ...values}).unwrap();
                        if(result.success === 1){
                            showState.setShowCategoryForm(!showState.showCategoryForm);
                            window.alert("新增成功");
                        }
                        else {
                            window.alert("已有此類別");
                        }
                    }}
                > 
                    { props => (
                        <Form>
                            <div className='form-InputBar'>
                                <label className='form-label'>類別 </label>
                                <Field as='select' className='form-select' name='type' >
                                    <option disabled value="default"> -- 請選擇 -- </option>
                                    <option value="income">收入</option>
                                    <option value="expenditure">支出</option>
                                </Field>
                            </div>
                            <div className='form-InputBar'>
                                <label className="form-label">名稱</label>
                                <Field as='input' className='form-input' name='name' placeholder="類別名稱" />
                            </div>
                            <ErrorMessage className="Category-ErrorMessage" name='name' component="div"/>
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

export default CategoryForm;