import "./BankDetail.css"

import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import { useDeleteBankRecordMutation, useGetBankQuery, useGetBankRecordQuery } from "../../../features/Bank/BankApiSlice";

import PageLabel from "../../../components/PageLabel/PageLabel";
import DetailTable from "../../../components/DetailTable/DetailTable";
import BankRecordForm from "../FormBank/BankRecordForm";
import FormBank from "../FormBank/FormBank";

const BankDetail = () => {
    const user_id = useSelector(selectCurrentUserId);

    const titles = ['類別', '日期', '金融機構','金額', "手續費"]
    const [ formData, setFormData ] = useState("");
    const [ showModifyForm, setShowModifyForm ] = useState(false);
    const {
        data: bankRecord,
        isSuccess: recIsSuccess
    } = useGetBankRecordQuery({user_id});

    const {
        data: banks,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({user_id});

    let tableContent;

    const phraseMap = {
        type:{
            deposit:"存款",
            withdraw:"提款",
            transfer_in:"轉入",
            transfer_out:"轉出"
        },
        bank:{}
    }

    const [ deleteBankRecord ] = useDeleteBankRecordMutation();
    const deleteRecord = async (ID) =>{
        const del = window.confirm("是否確認刪除紀錄?");
        console.log(ID);
        if(del){
            const result = await deleteBankRecord({ID}).unwrap();
            if(result.success === 1){
                window.alert("刪除成功");
            }
        }
    }

    if(bankIsSuccess && recIsSuccess){
        banks.forEach(element => phraseMap['bank'][element.bank_id] = element.name)
        tableContent = 
        bankRecord.map((item, index) => { return(
            <tr key={index}>
                <td className="table-data-cell">{phraseMap['type'][item.type]}</td>
                <td className="table-data-cell">{item.date}</td>
                <td className="table-data-cell">{phraseMap['bank'][item.bank_id]}</td>
                <td className="table-data-cell number">{item.amount}</td>
                <td className="table-data-cell number">{item.charge}</td>
                <td className="table-btn"><button onClick={() => {setFormData(item); setShowModifyForm(!showModifyForm)}}>修改</button></td>
                <td className="table-btn"><button onClick={() => deleteRecord(item.ID)}>刪除</button></td>
            </tr>
        )})
        
    }
    return (
        <>
            <PageLabel title={"金融機構:明細"} />
            <div className="detail-bank-container">
                <div className="detail-bank-content">
                    <div className="table-container">
                        <DetailTable 
                            titles={titles}
                            tableContent={tableContent}
                        />
                    </div>
                    <FormBank />
                    <BankRecordForm  onClick={() => setShowModifyForm(!showModifyForm)} showState={{showRecordForm: showModifyForm , setShowRecordForm:setShowModifyForm}} mode="modify" formData={formData} />
                </div>
            </div>
        </>
    )
}

export default BankDetail;