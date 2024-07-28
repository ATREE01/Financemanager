import BankRecordForm from "./BankRecordForm";
import BankForm from "./BankForm";

import { useState } from 'react';

const FormBank = ({userCurrency, bank}) => {
    const [show, setShow] = useState(false);
    const [showRecordForm, setShowRecordForm] = useState(false);
    const [showBankForm, setShowBankForm] = useState(false);
    const [showManageBankForm, setShowManageBankForm] = useState(false);

    const handleShowClick = () => setShow(!show);
    const handleNewRecordClick = () => setShowRecordForm(!showRecordForm);
    const handleNewBankClick = () => setShowBankForm(!showBankForm);
    // const handleManageBankClick = () => setShowManageBankForm(!showManageBankForm);

    return (
        <>
            <div className='record-btn-container'>
                <div className={`record-btn ${show ? "up-right" : ""}`} onClick={handleNewRecordClick}>
                    <i className="bi bi-pen"></i>
                </div>
                <div className={`record-btn ${show ? "left-up" : ""}`} onClick={handleNewBankClick}>
                    <i className="bi bi-plus-circle" ></i>
                </div> 
                {/* <div className={`record-btn ${show ? "left-down" : ""}` } onClick={handleManageBankClick}>
                    <i className="bi bi-gear"></i>
                </div> */}
                <div className='record-btn'  onClick={handleShowClick}>
                    <i className="bi bi-layers"></i>
                </div>
            </div>

            <BankRecordForm showState={{isShow: showRecordForm, setShow: setShowRecordForm}} userCurrency={userCurrency} bank={bank}/>
            <BankForm showState={{isShow: showBankForm, setShow: setShowBankForm}} userCurrency={userCurrency}  />
        </>
    )
}

export default FormBank;