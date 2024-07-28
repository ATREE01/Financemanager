import { useState } from "react";

import RecordForm from "./RecordForm";
import CategoryForm from "./CategoryForm";

const FormIncExp = ({currency, userCurrency, category, bank}) => {
    const [show, setShow] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showRecordForm, setShowRecordForm] = useState(false);
    const [showManageCategory, setShowManageCategory ] = useState(false);

    const handleShowClick = () => setShow(!show);
    const handleNewRecordClick = () => setShowRecordForm(!showRecordForm);
    const handleNewCategoryClick = () => setShowCategoryForm(!showCategoryForm);
    // const handleManageCategoryClick = () => setShowManageCategory(!showManageCategory);

    return (
        <>
            <div className='record-btn-container'>
                <div className={`record-btn ${show ? "up-right" : ""}`} onClick={handleNewRecordClick}>
                    <i className="bi bi-pen"></i>
                </div>
                <div className={`record-btn ${show ? "left-up" : ""}`} onClick={handleNewCategoryClick}>
                    <i className="bi bi-plus-circle" ></i>
                </div> 
                {/* <div className={`record-btn ${show ? "left-down" : ""}` } onClick={handleManageCategoryClick}>
                    <i className="bi bi-gear"></i>
                </div> */}
                <div className='record-btn'  onClick={handleShowClick}>
                    <i className="bi bi-layers"></i>
                </div>
            </div>
            <RecordForm showState={{isShow: showRecordForm, setShow:setShowRecordForm}} currency={currency} userCurrency={userCurrency} category={category} bank={bank}/>
            <CategoryForm showState={{isShow: showCategoryForm, setShow: setShowCategoryForm}}/>
        </>
    )
}

export default FormIncExp;