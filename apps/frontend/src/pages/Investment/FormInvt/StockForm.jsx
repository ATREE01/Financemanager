import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { Link } from "react-router-dom";
import { useAddStockMutation } from "../../../features/Invt/InvtApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";

const StockForm = ({showState}) => {

    const user_id = useSelector(selectCurrentUserId);
    const [ addStock ] = useAddStockMutation();

    return (
        <>
            {showState.isShow ? <div className="form-scrim" onClick={() => showState.setShow(!showState.isShow)}></div> : ""}
            <div className={`form-container ${showState.isShow ? "activate" : ""}`}>
                <div className='close-btn'>
                    <i className="bi bi-x-circle-fill" onClick={() => showState.setShow(!showState.isShow)}></i>
                </div>
                <div className='form-title'>新增股票</div>
                <Formik
                    initialValues={{
                        stock_symbol:"",
                        stock_name:""
                    }}
                    validationSchema={Yup.object().shape({
                        stock_symbol: Yup.string()
                        .required("請輸入代號")
                        .max(30, "代號過長!")
                        .matches(/^[a-zA-Z0-9]*:[a-zA-Z0-9]*$/, "請確認輸入格式"),
                        stock_name: Yup.string()
                        .required("請輸入名出")
                        .max(20, "名稱過長!")
                    })}
                    onSubmit={async (values, actions) => {
                        const result = await addStock({ user_id, ...values }).unwrap();
                        if(result.success === 1){
                            showState.setShow(!showState.setShow);
                            actions.resetForm();
                            window.alert("新增成功"); 
                        }
                        else if(result.errno === 1062){
                            window.alert(result.text);
                        }
                        else {
                            window.alert("發生不明錯誤，請通知管理員修理")
                        }

                    }}
                >
                    {props => (
                        <Form>
                            <div className="form-InputBar">
                                <label className="form-label underline"><Link to="https://www.google.com/finance/?hl=zh-TW" target="_blank">股票代號</Link></label>
                                <Field className="form-input" name="stock_symbol" />
                            </div>
                            <ErrorMessage className="form-ErrorMessage" name='stock_symbol' component="div"/>
                            <div className="-my-2 text-center text-xl"><span className='font-bold text-lg'>e.g. TPE:0050、NASDAQ:QQQ<br />可點擊左方超連結前往查詢</span></div>

                            <div className="form-InputBar">
                                <label className="form-label">股票名稱</label>
                                <Field className="form-input" name="stock_name" />
                            </div>

                            <ErrorMessage className="form-ErrorMessage" name='brokerage' component="div"/>

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

export default StockForm;