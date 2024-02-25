import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import { useDeleteBankRecordMutation, useGetBankQuery, useGetBankRecordQuery } from "../../../features/Bank/BankApiSlice";

import PageLabel from "../../../components/PageLabel/PageLabel";
import DetailTable from "../../../components/DetailTable/DetailTable";
import BankRecordForm from "../FormBank/BankRecordForm";
import FormBank from "../FormBank/FormBank";
import { useGetUserCurrencyQuery } from "../../../features/Currency/CurrencyApiSlice";

const BankDetail = () => {
    const user_id = useSelector(selectCurrentUserId);

    const titles = [ '日期', '類別', '金融機構', '金額', "幣別", "手續費"]
    const [ formData, setFormData ] = useState("");
    const [ showModifyForm, setShowModifyForm ] = useState(false);
    const {
        data: bankRecord,
        isSuccess: recIsSuccess
    } = useGetBankRecordQuery({user_id});

    const {
        data: bank,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({user_id});

    const {
        data: userCurrency,
        isSuccess: userCurIsSuccess
    } = useGetUserCurrencyQuery({ user_id });

    let tableContent;

    const phraseMap = {
        type:{
            deposit:"存款",
            withdraw:"提款",
            transfer_in:"轉入",
            transfer_out:"轉出"
        },
        bank:{},
        currency:{
            "TWD": "台幣"
        }
    }

    const [ deleteBankRecord ] = useDeleteBankRecordMutation();
    const deleteRecord = async (ID) =>{
        const del = window.confirm("是否確認刪除紀錄?");
        if(del){
            const result = await deleteBankRecord({ID}).unwrap();
            if(result.success === 1){
                window.alert("刪除成功");
            }
        }
    }

    if(bankIsSuccess && recIsSuccess && userCurIsSuccess){
        userCurrency.forEach(element => phraseMap['currency'][element.code] = element.name);
        bank.forEach(element => phraseMap['bank'][element.bank_id] = element.name)
        tableContent = 
        bankRecord.map((item, index) => { return(
            <tr key={index}>
                <td className="table-data-cell">{item.date}</td>
                <td className="table-data-cell">{phraseMap['type'][item.type]}</td>
                <td className="table-data-cell">{phraseMap['bank'][item.bank_id]}</td>
                <td className="table-data-cell number">{item.amount}</td>
                <td className="table-data-cell">{phraseMap['currency'][item.currency]}</td>
                <td className="table-data-cell number">{item.charge}</td>
                <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => {setFormData(item); setShowModifyForm(!showModifyForm)}}>修改</button></td>
                <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => deleteRecord(item.ID)}>刪除</button></td>
            </tr>
        )})
        
    }
    return (
        <div className="bg-slate-100 py-5 min-h-screen">
            <PageLabel title={"金融機構:明細"} />
            <div className="detail-bank-container">
                <div className="detail-bank-content mt-4 h-[80vh] w-full flex justify-center">
                    <div className="table-container">
                        <DetailTable 
                            titles={titles}
                            tableContent={tableContent}
                        />
                    </div>
                    <FormBank userCurrency={{isSuccess: userCurIsSuccess, data: userCurrency}} bank={{data: bank, isSuccess: bankIsSuccess}}/>
                    <BankRecordForm showState={{isShow: showModifyForm , setShow:setShowModifyForm}} mode="modify" formData={formData} userCurrency={{isSuccess: userCurIsSuccess, data: userCurrency}} bank={{data: bank, isSuccess: bankIsSuccess}}/>
                </div>
            </div>
        </div>
    )
}

export default BankDetail;