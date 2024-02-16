import { useState } from "react";
import BrokerageForm from "./brokerageForm";
import StockRecordForm from "./StockRecordForm";
import StockForm from "./StockForm";
import DividendForm from "./DividendForm";


const FormStock = ({bank, userCurrency, brokerage, stkList}) => {
    const [ show, setShow ] = useState(false);
    const [ showStockRecordForm, setShowStockRecordForm ] = useState(false);
    const [ showStockForm, setShowStockForm ] = useState(false);
    const [ showBrokerageForm, setShowBrokerageForm ] = useState(false);
    const [ showDividendForm, setShowDividendForm ] = useState(false);


    const handleShowClick = () => setShow(!show);

    return (
        <>
            <div className='record-btn-container '>
                <div className={`record-btn ${show ? "up-right" : ""}`} onClick={() => setShowStockForm(!showStockForm)}>
                    <i className="bi bi-plus-circle"></i>
                </div>
                {/* <div className={`record-btn ${show ? "left-up" : ""}` } >
                    <i className="bi bi-gear"></i>
                </div> */}
                <div className={`record-btn ${show ? "left-down" : ""}`} onClick={() => setShowBrokerageForm(!showBrokerageForm)}>
                    <i className="bi bi-bank2"></i>
                </div> 
                {/* outer */}
                <div className={`record-btn ${show ? "up-right-sec" : ""}`} onClick={() => setShowStockRecordForm(!showStockRecordForm)}>
                    <i className="bi bi-pen"></i>
                </div> 

                <div className={`record-btn ${show ? "up-middle-right-sec" : ""}`} onClick={() => setShowDividendForm(!showDividendForm)}>
                    <i className="bi bi-currency-dollar"></i>
                </div> 

                <div className='record-btn'  onClick={handleShowClick}>
                    <i className="bi bi-layers"></i>
                </div>
            </div>
            <BrokerageForm showState={{isShow: showBrokerageForm, setShow: setShowBrokerageForm}} userCurrency={userCurrency} />
            <StockForm showState={{isShow: showStockForm, setShow: setShowStockForm}} bank={bank}/>
            <StockRecordForm showState={{isShow: showStockRecordForm, setShow: setShowStockRecordForm}} bank={bank} userCurrency={userCurrency} brokerage={brokerage} stkList={stkList}/>
            <DividendForm showState={{isShow: showDividendForm, setShow: setShowDividendForm}} bank={bank} userCurrency={userCurrency} brokerage={brokerage} stkList={stkList}/>
        </>
    )
}

export default FormStock;