import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';
import { useAddIncExpCategoryMutation } from "../../../features/IncExp/IncExpApiSlice";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';



const CategoryForm = ({showState}) => {
    const user_id = useSelector(selectCurrentUserId);    
    const [ addIncExpCategory ] = useAddIncExpCategoryMutation();

    const onClick = () => showState.setShow(!showState.isShow);

    return (
        <>
            {showState.isShow ? <div className="form-scrim" onClick={onClick}></div> : ""}
            <div className={`form-container ${showState.isShow ? "activate" : ""}`}>
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
                        type:Yup.string()
                        .oneOf(['income', "expenditure"], "請選擇類別"),
                        name:Yup.string()
                        .required("請輸入名稱")
                        .max(16, "最多只能輸入16個字")
                        .matches(/^[\u4E00-\u9FFF0-9a-zA-Z]{0,16}$/, "只能輸入中文、英文或數字")
                    })}
                    onSubmit={async (values, actions) => {
                        const result = await addIncExpCategory({user_id, ...values}).unwrap();
                        if(result.success === 1){
                            showState.setShow(!showState.isShow);
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
                            <ErrorMessage className="form-ErrorMessage" name='type' component="div"/>
                            <div className='form-InputBar'>
                                <label className="form-label">名稱</label>
                                <Field as='input' className='form-input' name='name' placeholder="類別名稱" />
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='name' component="div"/>
                            <div className='form-btn'>
                                <button className='bg-slate-300 enabled:hover:bg-slate-500 border-2 border-black rounded-full disabled:opacity-25'  disabled={!props.dirty || !props.isValid}  type='submit' >提交</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
               
}

export default CategoryForm;