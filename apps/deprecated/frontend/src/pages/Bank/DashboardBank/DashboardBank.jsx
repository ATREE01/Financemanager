import { useSelector } from "react-redux";
import { useGetBankQuery, useGetBankRecordSumQuery, useGetTimeDepositRecordSumQuery } from "../../../features/Bank/BankApiSlice";
import { useGetFinRecordSumQuery } from "../../../features/IncExp/IncExpApiSlice";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";
import Chart from "react-google-charts";

import PageLabel from "../../../components/PageLabel/PageLabel";
import DetailTable from '../../../components/DetailTable/DetailTable';
import FormBank from '../FormBank/FormBank';
import { useGetCurTRRecordSumQuery, useGetExchangeRateQuery, useGetUserCurrencyQuery } from '../../../features/Currency/CurrencyApiSlice';
import { useGetDividendRecordSumQuery, useGetInvtRecordSumQuery } from '../../../features/Invt/InvtApiSlice';

const DashboardBank = () => { 
    //TODO: add the function for user to modify their initinal amount of each bank
    const pieChartOptions = {
        legend:{position:'top', maxLines:3},
        pieSliceText:"percentage",
        backgroundColor: 'transparent'
    };

    const values = ["currency", "total", "income", "expenditure", "deposit", "withdraw", "transfer_in", "transfer_out", "buy", "sell", "charge", "invt", "time_deposit", "initialAmount"];
    const titles = ["銀行名稱", "幣別", "現有金額", "收入", "支出", "存款", "提款", "轉入", "轉出", "買入", "賣出", "手續費",  "證券交易金額", "定存", "初始金額"]

    const user_id = useSelector(selectCurrentUserId);

    const {
        data: bank,
        isLoading: bankIsLoading,
        isSuccess: bankIsSuccess,
    } = useGetBankQuery({user_id});
    const {
        data:bankRecord,
        isLoading: recIsLoading,
        isSuccess: recIsSuccess
    } = useGetBankRecordSumQuery({user_id});//bankRecord
    const {
        data:finRecord,
        isLoading: finIsLoading,
        isSuccess: finIsSuccess
    } = useGetFinRecordSumQuery({user_id}); // IncExp with finance method
    const {
        data:tiSum,
        isLoading: tiSumIsLoading,
        isSuccess: tiSumIsSuccess
    } = useGetTimeDepositRecordSumQuery({user_id});
    const {
        data: exchangeRate,
        isLoading: exRateIsLoading,
        isSuccess: exRateIsSuccess
    } = useGetExchangeRateQuery();
    const{
        data:userCurrency,
        isLoading: iserCurIsLoading,
        isSuccess: userCurIsSuccess,
    } = useGetUserCurrencyQuery({ user_id })
    const {
        data: curTRRecordSum,
        isSuccess: curTRRecordSumIsSuccess
    } = useGetCurTRRecordSumQuery({ user_id })
    const {
        data: InvtRecSum,
        isSuccess: invtRecSumIsSuccess
    } = useGetInvtRecordSumQuery({ user_id })
    const {
        data: dividendRecSum,
        isSuccess: dividendReSumIsSuccess
    } = useGetDividendRecordSumQuery({ user_id })

    const phraseMap = {
        banks:{},
        currency:{
            "TWD":"台幣"
        }
    }
    const bankData = {};
    let tableContent;
    let bankChartData = [["bank", "amount"]];
    if(bankIsLoading || recIsLoading || finIsLoading || tiSumIsLoading || exRateIsLoading){
        tableContent = <tr><td>Loading. . .</td></tr>
    }
    else if(bankIsSuccess && recIsSuccess && finIsSuccess && tiSumIsSuccess && userCurIsSuccess && curTRRecordSumIsSuccess && invtRecSumIsSuccess && dividendReSumIsSuccess && exRateIsSuccess){
        userCurrency.forEach(element => phraseMap['currency'][element.code] = element.name);

        const getExchangeRate = (code) => {
            const result = exchangeRate.find(item => item.code === code);
            return result?.ExchangeRate ?? 1;
        }

        const getDividend = (bank_id) => {
            const result = dividendRecSum.filter(item => item.bank_id === bank_id).reduce((sum, item) => sum + item.amount, 0);
            return result;
        };
        tableContent = bank.map((item) =>  {
            bankData[item['bank_id']] = { // create the data for each bank
                initialAmount: item['initialAmount'],
                total: item['initialAmount'],
                currency: phraseMap["currency"][item['currency']],
                income: 0,
                expenditure: 0,
                deposit: 0,
                withdraw: 0,
                transfer_in: 0,
                transfer_out: 0,
                buy: 0,
                sell: 0,
                charge:0,
                invt:InvtRecSum[item['bank_id']] ?? 0,
                time_deposit: 0
            }
            phraseMap["banks"][item['bank_id']] = item['name'];
            const result = JSON.parse(bankRecord[item['bank_id']]?.result ?? "[]").reduce((acc, obj) => { // This function turn array of json to one json object
                const key = Object.keys(obj)[0];
                acc[key] = obj[key];
                return acc;
            }, {});
            bankData[item['bank_id']]['income'] +=  (finRecord[item['bank_id']]?.['inSum'] ?? 0) + getDividend(item.bank_id);// int-Interest
            bankData[item['bank_id']]['expenditure'] += (finRecord[item['bank_id']]?.['expSum'] ?? 0);
            bankData[item['bank_id']]['buy'] += curTRRecordSum['buy'][item['bank_id']] ?? 0;
            bankData[item['bank_id']]['sell'] += curTRRecordSum['sell'][item['bank_id']] ?? 0;
            bankData[item['bank_id']]['charge'] += (bankRecord[item['bank_id']]?.charge ?? 0) + (finRecord[item['bank_id']]?.charge ?? 0) + (curTRRecordSum[item['bank_id']]?.charge ?? 0);
            bankData[item['bank_id']]['time_deposit'] += (tiSum[item['bank_id']]?.['amoTot'] ?? 0);
            Object.keys(result).forEach(key => { bankData[item['bank_id']][key] += result[key];}) // add the value to each bank
            // have to add a documentation about how to value been calculated.
            bankData[item['bank_id']]["total"] += bankData[item['bank_id']]["income"] + bankData[item['bank_id']]["deposit"] + bankData[item['bank_id']]["transfer_in"]
            - bankData[item['bank_id']]["expenditure"] - bankData[item['bank_id']]["withdraw"] - bankData[item['bank_id']]["transfer_out"] - bankData[item['bank_id']]['charge']
            + bankData[item['bank_id']]['invt'] - (tiSum[item['bank_id']]?.['amoTot'] ?? 0) + bankData[item['bank_id']]['buy'] - bankData[item['bank_id']]['sell']; // amoTot-amountTot

            const value = (bankData[item.bank_id]['total'] + bankData[item.bank_id]['time_deposit']) * getExchangeRate(item.currency);
            bankChartData.push([ phraseMap["banks"][item['bank_id']], value > 0 ? value : 0]);
            return (
                <tr key={item.bank_id}>
                    <td className="table-data-cell" >{[[phraseMap['banks'][item.bank_id]]]}</td>   
                    {
                        values.map(value => <td className="table-data-cell number" value={value} key={value}>{bankData[item.bank_id][value]}</td>)
                    }
                </tr>
            )
        })

    }

    return(
        <div className="bg-slate-100 py-5 min-h-screen">
            <PageLabel title={"金融機構:總覽"}/>
            <div className="dash-bank-container mt-4 max-h-full flex justify-center">
                <div className="dash-bank-content w-[95%] flex flex-wrap justify-center">
                    <div className="text-center">
                        <div className='text-3xl font-bold'>資產分布(台)</div>
                        <Chart 
                            chartType="PieChart"
                            data={bankChartData}
                            options={pieChartOptions}
                            width={"20rem"}
                            height={"20rem"}
                        />
                    </div>
                    <div className="flex-1 overflow-auto min-w-[50%] max-h-[80vh] flex items-center scrollBar">
                        <DetailTable 
                            titles={titles}
                            tableContent={tableContent}
                        />
                    </div>
                    <FormBank userCurrency={{isSuccess: userCurIsSuccess, data: userCurrency}} bank={{data: bank, isSuccess: bankIsSuccess}}/>
                </div>
            </div>
        </div>
    )
}

export default DashboardBank;

