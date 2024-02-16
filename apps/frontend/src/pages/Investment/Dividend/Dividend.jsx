
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import { useDeleteDividendRecordMutation, useGetBrokerageQuery, useGetDividendRecordQuery, useGetStockQuery } from "../../../features/Invt/InvtApiSlice";
import PageLabel from "../../../components/PageLabel/PageLabel";
import DetailTable from "../../../components/DetailTable/DetailTable";
import { useGetBankQuery } from "../../../features/Bank/BankApiSlice";
import { useGetUserCurrencyQuery } from "../../../features/Currency/CurrencyApiSlice";
import FormStock from "../FormInvt/FormStock";
import DividendForm from "../FormInvt/DividendForm";
import { useState } from "react";

const Dividend = () => {

    const user_id = useSelector(selectCurrentUserId);

    const {
        data: brokerage,
        isSuccess: brkgIsSuccess
    } = useGetBrokerageQuery({ user_id });
    
    const {
        data: bank,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({ user_id });

    const {
        data: userCurrency,
        isSuccess: userCurIsSuccess
    } = useGetUserCurrencyQuery({ user_id });

    const {
        data: dividend,
        isSuccess: DividendIsSuccess
    } = useGetDividendRecordQuery({ user_id });
    
    const {
        data: stkList,
        isSuccess: stkListIsSuccess
    } = useGetStockQuery({ user_id });

    
    const titles = ['日期', '券商', '股票代號', "金融機構", "幣別", "金額"]

    const phraseMap = {
        bank:{}, brokerage:{}, currency:{TWD: "台幣"}
    }

    const [ deleteDividendRecord ] = useDeleteDividendRecordMutation();
    const deleteRecord = async (ID) =>{
        const del = window.confirm("是否確認刪除紀錄?");
        console.log(ID);
        if(del){
            const result = await deleteDividendRecord({ID}).unwrap();
            console.log(result);
            if(result.success === 1){
                window.alert("刪除成功");
            }
        }
    }

    const [ showDividendForm, setShowDividendForm ] = useState(false);
    const [ formData, setFormData ] = useState();

    let dividendContent;
    if(brkgIsSuccess && bankIsSuccess && DividendIsSuccess && userCurIsSuccess){
        brokerage.forEach(element => phraseMap['brokerage'][element.brokerage_id] = element.name);
        bank.forEach(element => phraseMap['bank'][element.bank_id] = element.name);
        userCurrency.forEach(element => phraseMap['currency'][element.code] = element.name);
        dividendContent = dividend.map((item, index) => 
            <tr key={index}>
                <td className="table-data-cell">{item.date}</td>
                <td className="table-data-cell">{phraseMap['brokerage'][item.brokerage_id]}</td>
                <td className="table-data-cell">{item.stock_symbol}</td>
                <td className="table-data-cell">{phraseMap['bank'][item.bank_id]}</td>
                <td className="table-data-cell">{phraseMap['currency'][item.currency]}</td>
                <td className="table-data-cell">{item.amount}</td>
                <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => {setFormData(item); setShowDividendForm(!showDividendForm)}}>修改</button></td>
                <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => deleteRecord(item.ID)}>刪除</button></td>
            </tr>
        )
    }


    return(
        <div className="bg-slate-100 py-5 min-h-screen">
            <PageLabel title={"股息"} />
            <div className="mt-4 flex justify-center">
                <div className="h-[80vh] w-3/5">
                    <DetailTable titles={titles} tableContent={dividendContent}/>
                </div>
                <FormStock bank={{data: bank, isSuccess: bankIsSuccess}} userCurrency={{isSuccess:userCurIsSuccess, data:userCurrency}} brokerage={{data: brokerage, isSuccess: brkgIsSuccess}} stkList={{data: stkList, isSuccess: stkListIsSuccess}}/>
                <DividendForm showState={{isShow: showDividendForm, setShow: setShowDividendForm}} bank={{data: bank, isSuccess: bankIsSuccess}} userCurrency={{isSuccess:userCurIsSuccess, data:userCurrency}} brokerage={{data: brokerage, isSuccess: brkgIsSuccess}} stkList={{data: stkList, isSuccess: stkListIsSuccess}} mode="modify" formData={formData}/>
            </div>     
               
        </div>
    )
}

export default Dividend;