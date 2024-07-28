

import { useState } from 'react';
import TransactionRecord from './TransactionRecord';

const FormCurrency = ({userCurrency, bank}) => {
    const [show, setShow] = useState(false);
    const [showTransctionForm, setShowTransactionForm] = useState(false);

    const handleShowClick = () => setShow(!show);
    const handleNewTransactionnClick = () => setShowTransactionForm(!showTransctionForm);

    return (
        <>
            <div className='record-btn-container'>
                <div className={`record-btn ${show ? "up-right" : ""}`} onClick={handleNewTransactionnClick}>
                    <i className="bi bi-pen"></i>
                </div>
                {/* <div className={`record-btn ${show ? "left-up" : ""}`} onClick={handleNewBankClick}>
                    <i className="bi bi-plus-circle" ></i>
                </div> 
                <div className={`record-btn ${show ? "left-down" : ""}` } onClick={handleManageBankClick}>
                    <i className="bi bi-gear"></i>
                </div> */}
                <div className='record-btn'  onClick={handleShowClick}>
                    <i className="bi bi-layers"></i>
                </div>
            </div>
            <TransactionRecord showState={{isShow: showTransctionForm, setShow: setShowTransactionForm}} userCurrency={userCurrency} bank={bank}/>
            
        </>
    )
}

export default FormCurrency;