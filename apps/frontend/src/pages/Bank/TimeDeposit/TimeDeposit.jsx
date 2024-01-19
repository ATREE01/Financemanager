import "./TimeDeposit.css";

import { useState } from "react";
import PageLabel from "../../../components/PageLabel/PageLabel";
import TiDptRecordForm from "../TimeDepositRecordForm/TiDptRecordForm";
import { useDeleteTimeDepositRecordMutation, useGetBankQuery, useGetTimeDepositRecordQuery } from "../../../features/Bank/BankApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import DetailTable from "../../../components/DetailTable/DetailTable";

const TimeDeposit = () =>{
    //TODO: add a document about how this pages works
    const user_id = useSelector(selectCurrentUserId);

    const [ show, setShow ] = useState(false);
    const [ showRecordForm, setShowRecordForm] = useState(false);
    const [ showModifyForm, setShowModifyForm ] = useState(false);

    const handleShowClick = () => setShow(!show);
    const handleNewRecordClick = () => setShowRecordForm(!showRecordForm);
    const handleModifyRecordClick = () => setShowModifyForm(!showModifyForm);

    const [ formData, setFormData ] = useState("");

    const titles = ["金融機構", "種類", "幣別", "總金額", "利率", "開始日期", "結束日期","累計利息"]
    const {
        data: banks,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({user_id});
    
    const {
        data: timeDepositRecord,
        // isLoading: tiDepIsLoading,
        isSuccess: tiDepIsSuccess
    } = useGetTimeDepositRecordQuery({user_id});
    
    const [ deleteTimeDepositRecord ] = useDeleteTimeDepositRecordMutation();
    const deleteRecord = async (ID) =>{
        const del = window.confirm("是否確認刪除紀錄?");
        if(del){
            const result = await deleteTimeDepositRecord({ID}).unwrap();
            if(result.success === 1){
                window.alert("刪除成功");
            }
        }
    }    

    let tableContent;

    const phraseMap = {
        banks:{},
        type:{
            "part-deposit-all-withdraw": "零存整付",
            "all-deposit-all-withdraw": "整存整付",
            "all-deposit-part-interest": "存本取息"
        },
        currency:{//TODO: This have to be add by query after the foreign currency function is implemented
            "TWD": "台幣" 
        }
    }
    if(bankIsSuccess && tiDepIsSuccess){
        banks.forEach(element => {
            phraseMap["banks"][element['bank_id']] = element['name'];
        });
        tableContent = 
        timeDepositRecord.map((item, index) => {
            return (
                <tr key={index}>
                    <td className="table-data-cell">{phraseMap['banks'][item.bank_id]}</td>
                    <td className="table-data-cell">{phraseMap['type'][item.type]}</td>
                    <td className="table-data-cell">{phraseMap['currency'][item.currency]}</td>
                    <td className="table-data-cell number">{item.amount}</td>
                    <td className="table-data-cell number">{item.interest}</td>
                    <td className="table-data-cell number">{item.startDate}</td>
                    <td className="table-data-cell number">{item.endDate}</td>
                    <td className="table-data-cell number">{item.accInterest}</td>
                    <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-2 border-black " onClick={() => {setFormData(item); setShowModifyForm(!showModifyForm) }}>修改</button></td>
                    <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-2 border-black " onClick={() => deleteRecord(item.ID)}>刪除</button></td>
                </tr>
            )
        })
    }

    return (
        <>
            <PageLabel title={"金融機構:定存"} />
            <div className="TimeDeposit-container">
                <div className="TimeDeposit-content">
                    <div className="table-container">
                        <DetailTable 
                            titles={titles}
                            tableContent={tableContent}
                        />
                    </div>
                    <div className='record-btn-container'>
                        <div className={`record-btn ${show ? "up-right" : ""}`} onClick={handleNewRecordClick}>
                            <i className="bi bi-pen"></i>
                        </div>
                        <div className={`record-btn ${show ? "left-up" : ""}`} > {/*This button will show a document to describe how this page work */}
                        <i className="bi bi-question-lg"></i>
                        </div> 
                        <div className='record-btn'  onClick={handleShowClick}>
                            <i className="bi bi-layers"></i>
                        </div>
                    </div>

                    <TiDptRecordForm onClick={handleNewRecordClick} showState={{showForm:showRecordForm, setShowForm:setShowRecordForm }} bank={{banks, bankIsSuccess}}/>
                    <TiDptRecordForm onClick={handleModifyRecordClick} showState={{showForm:showModifyForm, setShowForm:setShowModifyForm}} bank={{banks, bankIsSuccess}} mode="modify" formData={formData}/>
                </div>

            </div>

        </>
    )
}

export default TimeDeposit;

