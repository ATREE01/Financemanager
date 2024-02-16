import { useSelector } from "react-redux";
import DetailTable from "../../../components/DetailTable/DetailTable";
import PageLabel from "../../../components/PageLabel/PageLabel";
import { useDeleteStockRecordMutation, useGetBrokerageQuery, useGetStockQuery, useGetStockRecordQuery } from "../../../features/Invt/InvtApiSlice";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import StockOption from "./StockOption";
import { useState } from "react";
import { useGetBankQuery } from "../../../features/Bank/BankApiSlice";
import { useGetUserCurrencyQuery } from "../../../features/Currency/CurrencyApiSlice";

import StockRecordForm from "../FormInvt/StockRecordForm";
import FormStock from "../FormInvt/FormStock";

const StockDetail = () => {

    const [ stock_symbol, setStockSymbol ] = useState('ALL');
    const [ formData, setFormData ] = useState();
    const [ showModifyForm, setShowModifyForm ] = useState(false);

    const user_id = useSelector(selectCurrentUserId);
    const titles = ["日期", "券商", "操作類型", "買入方法", "金融機構", "交易幣別", "交割幣別", "股票代號", "股票名稱", "總金額", "交易股價", "元買入股價", "股數", "匯率", "手續費", "稅金","備註"]

    const {
        data: bank,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({ user_id });

    const {
        data: brokerageList,
        isSuccess: brkgIsSuccess
    } = useGetBrokerageQuery({ user_id });

    const {
        data: userCurrency,
        isSuccess: userCurIsSuccess
    } = useGetUserCurrencyQuery({ user_id });

    const {
        data: stkList,
        isSuccess: stkListIsSuccess
    } = useGetStockQuery({ user_id });

    const {
        data: stockRecord,
        isSuccess: stkRcdIsSuccess
    } = useGetStockRecordQuery({ user_id, stock_symbol });

    const phraseMap = {
        "bank": {},
        "brokerage": {},
        "action": {
            buy: "買入",
            sell: "賣出"
        },
        "type": {
            manually: "手動買入",
            regular: "定期定額"
        },
        "currency": {
            TWD: "台幣"
        },
        "stock": {}

    }

    const [ deleteStockRecord ] = useDeleteStockRecordMutation();
    const deleteRecord = async (ID) =>{
        const del = window.confirm("是否確認刪除紀錄?");
        if(del){
            const result = await deleteStockRecord({ID}).unwrap();
            console.log(result);
            if(result.success === 1){
                window.alert("刪除成功");
            }
        }
    }

    let stockContent, stkRcdTableContent;
    let brokerageData = {};
    if(bankIsSuccess && brkgIsSuccess && userCurIsSuccess && stkListIsSuccess && stkRcdIsSuccess){
        bank.forEach(element => { phraseMap['bank'][element.bank_id] = element.name});
        userCurrency.forEach(element => { phraseMap['currency'][element.code] = element.name })
        brokerageList.forEach(element => {
            phraseMap['brokerage'][element.brokerage_id] = element.name;
            brokerageData[element.brokerage_id] = {
                transactionCur: element.transactionCur,
                settlementCur: element.settlementCur
            }
        });
        stkList.forEach(element => phraseMap['stock'][element.stock_symbol] = element.stock_name)
        stockContent = <StockOption data={stkList} setStockSymbol={setStockSymbol} />
        stkRcdTableContent= stockRecord.map((item, index) => {      
               
            return <tr className="table-recordRow" key={index}>
                <td className="table-data-cell">{item.date}</td>
                <td className="table-data-cell text-center">{ phraseMap['brokerage'][item.brokerage_id] }</td>
                <td className="table-data-cell text-center">{ phraseMap['action'][item.action] }</td>
                <td className="table-data-cell text-center">{ phraseMap['type'][item.type] ?? "X" }</td>
                <td className="table-data-cell text-center">{ phraseMap['bank'][item.bank_id]}</td>
                <td className="table-data-cell text-center">{ phraseMap['currency'][brokerageData[item.brokerage_id].transactionCur]}</td>
                <td className="table-data-cell text-center">{ phraseMap['currency'][brokerageData[item.brokerage_id].settlementCur] }</td>
                <td className="table-data-cell text-center">{ item.stock_symbol }</td>
                <td className="table-data-cell text-center">{ phraseMap["stock"][item.stock_symbol] }</td>
                <td className="table-data-cell text-center">{ item.total }</td>
                <td className="table-data-cell text-center">{ item.action === "buy" ? item.buy_stock_price : item.sell_stock_price }</td>
                <td className="table-data-cell text-center">{ item.action === "sell" ? item.buy_stock_price : 'X' }</td>
                <td className="table-data-cell text-center">{ item.share_number }</td>
                <td className="table-data-cell text-center">{ item.exchange_rate ?? 'X' }</td>
                <td className="table-data-cell text-center">{ item.charge }</td>
                <td className="table-data-cell text-center">{ item.tax }</td>
                <td className="table-data-cell text-center">{ item.note }</td>
                <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => {setFormData(item); setShowModifyForm(!showModifyForm)}}>修改</button></td>
                <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => deleteRecord(item.ID)}>刪除</button></td>
            </tr>
    });
    }

    return (
        <div className="bg-slate-100 py-5 min-h-screen">
            <PageLabel title="投資:股票明細" />
            <div className="StcokDetail-container mt-4 max-h-screen">
                <div className="StockDetail-content h-[80vh] w-full flex flex-col items-center">
                    <div className="stock-select max-w-80 min-w-40 h-12 font-bold text-2xl">
                        { stockContent }
                    </div>

                    <div className="table-container mt-4">
                        <DetailTable titles={titles} tableContent={ stkRcdTableContent }/>
                    </div>
                    <FormStock bank={{data: bank, isSuccess: bankIsSuccess}} userCurrency={{isSuccess:userCurIsSuccess, data:userCurrency}} brokerage={{data: brokerageList, isSuccess: brkgIsSuccess}} stkList={{data: stkList, isSuccess: stkListIsSuccess}}/>
                    <StockRecordForm showState={{isShow: showModifyForm, setShow: setShowModifyForm}} bank={{data: bank, isSuccess: bankIsSuccess}} userCurrency={{isSuccess:userCurIsSuccess, data:userCurrency}} brokerage={{data: brokerageList, isSuccess: brkgIsSuccess}} stkList={{data: stkList, isSuccess: stkListIsSuccess}} mode="modify" formData={formData}/>
                </div>

            </div>
        </div>
    )
}

export default StockDetail;
