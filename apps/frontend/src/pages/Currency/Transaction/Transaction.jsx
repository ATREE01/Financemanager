import { useSelector } from "react-redux";
import DetailTable from "../../../components/DetailTable/DetailTable";
import PageLabel from "../../../components/PageLabel/PageLabel";
import { useGetBankQuery } from "../../../features/Bank/BankApiSlice";
import { useDeleteCurTRRecordMutation, useGetCurTRRecordQuery, useGetUserCurrencyQuery } from "../../../features/Currency/CurrencyApiSlice";
import FormCurrency from "../FormCurrency/FormCurrency";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import { useState } from "react";
import TransactionRecord from "../FormCurrency/TransactionRecord";

const Transaction = () => {
    const user_id = useSelector(selectCurrentUserId);
    const titles=["日期", "入金機構", "出金機構", "買入金額", "賣出金額", "匯率", "手續費"];

    const [ formData, setFormData ] = useState("");
    const [ showModifyForm, setShowModifyForm ] = useState(false);

    const {
        data: bank,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({user_id});

    const {
        data: userCurrency,
        isSuccess: userCurIsSuccess
    } = useGetUserCurrencyQuery({ user_id });

    const {
        data: curTRRecord,
        isSuccess: curTRRecordIsSuccess
    } = useGetCurTRRecordQuery({ user_id });

    const phraseMap = {
        bank:{},
        currency:{
            "TWD": "台幣"
        }
    }

    const [ deleteCurTRRecord ] = useDeleteCurTRRecordMutation();
    const deleteRecord = async (ID) => {
        const del = window.confirm("是否確認刪除紀錄?");
        if(del){
            const result = await deleteCurTRRecord({ID}).unwrap();
            if(result.success === 1){
                window.alert("刪除成功");
            }
        }
    }

    let tableContent;
    if(bankIsSuccess && curTRRecordIsSuccess){
        bank.forEach(bank => phraseMap['bank'][bank.bank_id] = bank.name);
        tableContent = curTRRecord.map((item, index) => 
            <tr key={index}>
                <td className="table-data-cell">{item.date}</td>
                <td className="table-data-cell">{phraseMap['bank'][item.buy_bank_id]}</td>
                <td className="table-data-cell">{phraseMap['bank'][item.sell_bank_id]}</td>
                <td className="table-data-cell">{item.buy_amount}</td>
                <td className="table-data-cell">{item.sell_amount}</td>
                <td className="table-data-cell">{item.ExchangeRate}</td>
                <td className="table-data-cell">{item.charge}</td>
                <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => {setFormData(item); setShowModifyForm(!showModifyForm)}}>修改</button></td>
                <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => deleteRecord(item.ID)}>刪除</button></td>
            </tr>
        )
    }

    return (
        <>
            <div className="bg-slate-100 py-5 min-h-screen">
                <PageLabel title="外幣買賣" />
                <div className="mt-4 h-[80vh] w-full flex justify-center">
                    <div className="table-container">
                        <DetailTable titles={titles} tableContent={tableContent}/>
                    </div>  
                    <FormCurrency userCurrency={{isSuccess: userCurIsSuccess, data: userCurrency}} bank={{data: bank, isSuccess: bankIsSuccess}}/>
                    <TransactionRecord showState={{isShow: showModifyForm, setShow: setShowModifyForm}} userCurrency={{isSuccess: userCurIsSuccess, data: userCurrency}} bank={{data: bank, isSuccess: bankIsSuccess}} mode="modify" formData={formData}/>
                </div>
            </div>
        </>
    )
}
export default Transaction;