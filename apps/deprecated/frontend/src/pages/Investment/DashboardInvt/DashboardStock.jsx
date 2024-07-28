import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useGetBrokerageQuery, useGetDividendRecordSumQuery, useGetStkRecPriceSumQuery, useGetStockPriceQuery, useGetStockQuery, useGetStockRecordSumQuery } from "../../../features/Invt/InvtApiSlice";
import { useGetExchangeRateQuery, useGetUserCurrencyQuery } from "../../../features/Currency/CurrencyApiSlice";
import { useGetBankQuery } from "../../../features/Bank/BankApiSlice";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import { Chart } from "react-google-charts";

import PageLabel from "../../../components/PageLabel/PageLabel";
import FormStock from "../FormInvt/FormStock";
import BrokerageOption from "./BrokerageOption";
import DetailTable from "../../../components/DetailTable/DetailTable";
import StockRecordForm from '../FormInvt/StockRecordForm';

const DashboardStock = () => {
    const user_id = useSelector(selectCurrentUserId);
    const [ brokerage, setBrokerage ] = useState('ALL');
    const [ currency, setCurrency ] = useState('ALL');

    const {
        data: brokerageList,
        isSuccess: brkgIsSuccess
    } = useGetBrokerageQuery({user_id})

    const {
        data: userCurrency,
        isLoading: userCurIsLoading,
        isSuccess: userCurIsSuccess,
    } = useGetUserCurrencyQuery({ user_id })

    const {
        data: exRate,
        isLoading: exRateIsLoading,
        isSuccess: exRateIsSuccess
    } = useGetExchangeRateQuery()

    const {
        data: bank,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({ user_id });

    const {
        data: stkList,
        isSuccess: stkListIsSuccess
    } = useGetStockQuery({ user_id });

    const {
        data: stkPrice,
        isSuccess: stkPriceIsSuccess
    } = useGetStockPriceQuery({ user_id });

    const {
        data: stkRecSum,
        isSuccess: stkRecSumIsSuccess
    } = useGetStockRecordSumQuery({ user_id, brokerage });

    const {
        data: stkRecPriceSum,
        isSuccess: stlRecPriceSumIsSuccess
    } = useGetStkRecPriceSumQuery({ user_id, brokerage });

    const {
        data: dividendRecSum,
        isSuccess: dividendReSumIsSuccess
    } = useGetDividendRecordSumQuery({ user_id })
    
    const [ formData, setFormData ] = useState("");
    const [ showSellForm, setShowSellForm ] = useState("");

    const pieChartOptions = {
        legend:{position:'top', maxLines:3},
        pieSliceText:"percentage",
        backgroundColor: 'transparent'
    };

    const normalTitles = ["", "券商", "幣別", "股票代號", "股票名稱", "持有股數", "總成本", "平均成本", "參考股價", "參考現值", "股息", "已實現損益", "未實現損益"]
    const subNormalTitles = ["交易股價", "持有股數", "持有成本", "市值", "已實現損益", "未實現損益"]
    const exchangeTitles = ["", "券商", "股票代號", "股票名稱","交易幣別", "交割幣別", "持有股數", "總成本(易)", "總成本(割)", "平均成本(易)", "參考股價", "參考現值(易)", "參考現值(割)", "股息(易)", "已實現損益(易)", "未實現損益(易)", "未實現損益(割)"]
    const phraseMap = {
        brokerage: {},
        stock: {},
        stkPrice: {},
        currency:{
            TWD: {
                name: "台幣",
                exchangeRate: 1
            }
        },
        dividend:{  
        }
    }

    let chartData = [["股票", "市值"]]
    let brokerageData = {};

    const [isSubTableExpanded, setIsSubTableExpanded] = useState([]);
    const handleToggleSubTable = (index) => {
        const updatedExpandedState = [...isSubTableExpanded];
        updatedExpandedState[index] = !updatedExpandedState[index];
        setIsSubTableExpanded(updatedExpandedState);
    };
    
    let BrokerageContent;
    let normalStkRecSum = [], exchangeStkRecSum = [];

    if(exRateIsSuccess && brkgIsSuccess && stkRecSumIsSuccess && stkListIsSuccess &&  stkPriceIsSuccess && dividendReSumIsSuccess && stlRecPriceSumIsSuccess){
        exRate.forEach(element => phraseMap['currency'][element.code] = { name: element.name, exchangeRate: element.ExchangeRate})
        brokerageList.forEach(element => {
            brokerageData[element.brokerage_id] = {
                transactionCur: element.transactionCur,
                settlementCur: element.settlementCur
            };
            phraseMap['brokerage'][element.brokerage_id] = element.name;
        })
        stkList.forEach(element => phraseMap['stock'][element.stock_symbol] = element.stock_name)
        stkPrice.forEach(element => phraseMap['stkPrice'][element.stock_symbol] = element.stock_price);
        BrokerageContent = <BrokerageOption data={brokerageList} setBrokerage={setBrokerage} setCurrency={setCurrency} />
        
        const getDividend = (brokerageId, stockSymbol) => {
            const result = dividendRecSum.find(item => item.brokerage_id === brokerageId && item.stock_symbol === stockSymbol);
            return result ? result.amount : 0; // Return amount or null if not found
        };
    
        const getPriceDetail = (brokerageId, stockSymbol) => {
            const result = stkRecPriceSum.filter((item) => {
                return item.brokerage_id === brokerageId && item.stock_symbol === stockSymbol;
            })
            return result;
        }
        

        stkRecSum.forEach((item, index) => {
            const transactionCur = brokerageData[item.brokerage_id].transactionCur, settlementCur = brokerageData[item.brokerage_id].settlementCur;
            const stock_price = phraseMap['stkPrice'][item.stock_symbol];
            const exchangeRate = phraseMap['currency'][transactionCur].exchangeRate;
            const value = (item.hold_share_number * stock_price).toFixed(3) * 1;
            const dividend = getDividend(item.brokerage_id, item.stock_symbol);
            chartData.push([phraseMap['stock'][item.stock_symbol], value * exchangeRate]);
            const priceDetail = getPriceDetail(item.brokerage_id, item.stock_symbol);
            if(transactionCur === settlementCur){            
                normalStkRecSum.push(
                    <React.Fragment key={index}>
                        <tr  className="table-recordRow">
                            <td className="text-center">
                                <button
                                    onClick={() => handleToggleSubTable(index)}
                                    className={`bi bi-caret-${isSubTableExpanded[index] ? 'up' : 'down'}-fill`}
                                ></button>
                            </td>
                            <td className="table-data-cell text-center">{phraseMap['brokerage'][item.brokerage_id]}</td>
                            <td className="table-data-cell text-center">{phraseMap['currency'][transactionCur].name}</td>
                            <td className="table-data-cell text-center">{item.stock_symbol}</td>
                            <td className="table-data-cell text-center">{phraseMap['stock'][item.stock_symbol]}</td>
                            <td className="table-data-cell text-center">{item.hold_share_number}</td>
                            <td className="table-data-cell text-center">{item.hold_settlement_cost}</td>
                            <td className="table-data-cell text-center">{item.hold_share_number !== 0 ? (item.hold_settlement_cost / item.hold_share_number).toFixed(3) * 1 : 0}</td>
                            <td className="table-data-cell text-center">{phraseMap['stkPrice'][item.stock_symbol]}</td>
                            <td className="table-data-cell text-center">{value}</td>
                            <td className="table-data-cell text-center">{dividend}</td>
                            <td className="table-data-cell text-center">{item.realized}({(item.sold_settlement_cost ?? 0 )!== 0 ? (item.realized / item.sold_settlement_cost * 100).toFixed(2) * 1 : 0}%)</td>
                            <td className="table-data-cell text-center">{(value - item.hold_settlement_cost).toFixed(3) * 1}({ item.hold_settlement_cost !== 0 ? ((value / item.hold_settlement_cost - 1) * 100).toFixed(2) * 1 : 0}%)</td>
                        </tr>
                        {isSubTableExpanded[index] && (
                            <tr className="table-recordRow">
                                <td></td>
                                <td className="px-0" colSpan="10">
                                    <DetailTable titles={subNormalTitles} tableContent={
                                        priceDetail.map((item, index) => {
                                            const value = (item.hold_share_number * stock_price).toFixed(3) * 1;                        
                                            return <tr key={index}  className="table-recordRow">
                                                <td className="table-data-cell">{item.buy_stock_price}</td>
                                                <td className="table-data-cell">{item.hold_share_number}</td>
                                                <td className="table-data-cell">{item.hold_cost}</td>
                                                <td className="table-data-cell">{value}</td>
                                                <td className="table-data-cell">{item.realized ?? 0}</td>
                                                <td className="table-data-cell">{value - item.hold_share_number * item.buy_stock_price}({item.hold_share_number !== 0 ? ((stock_price / item.buy_stock_price - 1) * 100).toFixed(2) * 1 : 0}%)</td>
                                                {item.hold_share_number !== 0 && <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => {setFormData(item); setShowSellForm(!showSellForm)}}>賣出</button></td>}
                                                
                                            </tr>
                                        })
                                    }/>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                )
            }
            else{
                exchangeStkRecSum.push(
                    <React.Fragment key={index}>
                        <tr key={index} className="table-recordRow">
                            <td className="text-center">
                                <button
                                    onClick={() => handleToggleSubTable(index)}
                                    className={`bi bi-caret-${isSubTableExpanded[index] ? 'up' : 'down'}-fill`}
                                ></button>
                            </td>
                            <td className="table-data-cell text-center ">{phraseMap['brokerage'][item.brokerage_id]}</td>
                            <td className="table-data-cell text-center">{item.stock_symbol}</td>
                            <td className="table-data-cell text-center">{phraseMap['stock'][item.stock_symbol]}</td>
                            <td className="table-data-cell text-center">{phraseMap['currency'][transactionCur].name}</td>
                            <td className="table-data-cell text-center">{phraseMap['currency'][settlementCur].name}</td>
                            <td className="table-data-cell text-center">{item.hold_share_number}</td>
                            <td className="table-data-cell text-center">{item.hold_transaction_cost.toFixed(2)}</td>
                            <td className="table-data-cell text-center">{item.hold_settlement_cost}</td>
                            <td className="table-data-cell text-center">{item.hold_share_number !== 0 ? (item.hold_transaction_cost / item.hold_share_number).toFixed(2) : 0}</td>
                            <td className="table-data-cell text-center">{phraseMap['stkPrice'][item.stock_symbol]}</td>
                            <td className="table-data-cell text-center">{value}</td>
                            <td className="table-data-cell text-center">{(value * exchangeRate).toFixed(2) * 1}</td>
                            <td className="table-data-cell text-center">{dividend}</td>
                            <td className="table-data-cell text-center">{item.realized ?? 0}({(item.sold_settlement_cost ?? 0 )!== 0 ? (item.realized / item.sold_settlement_cost * 100).toFixed(2) * 1 : 0}%)</td>
                            <td className="table-data-cell text-center">{(value - item.hold_transaction_cost).toFixed(2) * 1}({(item.hold_transaction_cost ?? 0) !== 0 ? ((value / item.hold_transaction_cost - 1) * 100).toFixed(3) * 1 : 0}%)</td>
                            <td className="table-data-cell text-center">{(value * exchangeRate  - item.hold_settlement_cost).toFixed(2) * 1}({ item.hold_settlement_cost !== 0 ? ((value * exchangeRate / item.hold_settlement_cost - 1) * 100).toFixed(2) * 1 : 0}%)</td>
                        </tr>
                        {isSubTableExpanded[index] && (
                            <tr className="table-recordRow">
                                <td></td>
                                <td className="px-0" colSpan="8">
                                    <DetailTable titles={subNormalTitles} tableContent={
                                        priceDetail.map((item, index) => {
                                            const value = (item.hold_share_number * stock_price).toFixed(3) * 1;                        
                                            return <tr key={index}  className="table-recordRow">
                                                <td className="table-data-cell">{item.buy_stock_price}</td>
                                                <td className="table-data-cell">{item.hold_share_number}</td>
                                                <td className="table-data-cell">{item.hold_cost}</td>
                                                <td className="table-data-cell">{value}</td>
                                                <td className="table-data-cell">{item.realized ?? 0}</td>
                                                <td className="table-data-cell">{(value - item.hold_share_number * item.buy_stock_price).toFixed(2) * 1}({item.hold_share_number !== 0 ? ((stock_price / item.buy_stock_price - 1) * 100).toFixed(2) * 1 : 0}%)</td>
                                                {item.hold_share_number !== 0 && <td className="table-btn"><button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded" onClick={() => {setFormData(item); setShowSellForm(!showSellForm)}}>賣出</button></td>}
                                            </tr>
                                        })
                                    }/>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                )
            }
        })
    }

    useEffect(() => {
        let index;
        if(brokerage !== "ALL"){
            index = brokerageList.findIndex(item => item.brokerage_id === brokerage);
            setCurrency(brokerageList[index].currency);
        }
    }, [brokerage])

    return (
        <div className="bg-slate-100 py-5 min-h-screen">
            <PageLabel title={"投資:股票總覽"} />
            <div className="Dash-Invt-container mt-4">
                <div className="Dash-Invt-content h-[80vh] w-full flex flex-col items-center">
                    <div className="brokerage-select max-w-90 min-w-40 h-12 font-bold text-2xl">
                        { BrokerageContent }
                    </div>
                    <div className="flex flex-wrap w-[95vw] mt-4 justify-center">
                        <div className="text-center">
                            <div className='text-3xl font-bold'>資產分布</div>
                            <Chart 
                                chartType="PieChart"
                                data={chartData}
                                options={pieChartOptions}
                                width={"20rem"}
                                height={"20rem"}
                            />
                        </div>
                        <div className="flex-1 overflow-auto min-w-[50%] max-h-[80vh]">
                            <div className="overflow-auto scrollBar">
                                <DetailTable titles={normalTitles} tableContent={normalStkRecSum} />
                            </div>
                            <br/>
                            <div className="overflow-auto scrollBar">
                                <DetailTable titles={exchangeTitles} tableContent={exchangeStkRecSum} />
                            </div>
                        </div>
                    </div>
                    <FormStock bank={{data: bank, isSuccess: bankIsSuccess}} userCurrency={{isSuccess:userCurIsSuccess, data:userCurrency}} brokerage={{data: brokerageList, isSuccess: brkgIsSuccess}} stkList={{data: stkList, isSuccess: stkListIsSuccess}}/>
                    <StockRecordForm showState={{isShow: showSellForm, setShow: setShowSellForm}} bank={{data: bank, isSuccess: bankIsSuccess}} userCurrency={{isSuccess:userCurIsSuccess, data:userCurrency}} brokerage={{data: brokerageList, isSuccess: brkgIsSuccess}} stkList={{data: stkList, isSuccess: stkListIsSuccess}} mode="new" action='sell' formData={formData}/>
                </div>
            </div>
        </div>
    )
}

export default DashboardStock;