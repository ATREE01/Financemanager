import '../../../assets/table.css';
import './DashboardBank.css';
import { useSelector } from "react-redux";
import { useGetBankQuery, useGetBankRecordSumQuery, useGetTimeDepositRecordSumQuery } from "../../../features/Bank/BankApiSlice";
import { useGetFinRecordSumQuery } from "../../../features/IncExp/IncExpApiSlice";
import { selectCurrentUserId } from "../../../features/Auth/AuthSlice";

import PageLabel from "../../../components/PageLabel/PageLabel";
import DetailTable from '../../../components/DetailTable/DetailTable';
import FormBank from '../FormBank/FormBank';
import { useGetUserCurrencyQuery } from '../../../features/Currency/CurrencyApiSlice';

const DashboardBank = () => { //TODO: 外幣還沒做 新增帳戶的時候要選擇幣別

    const values = ["currency", "amount", "income", "expenditure", "deposit", "withdraw", "transfer_in", "transfer_out", "charge", "time_deposit"];
    const titles = ["銀行名稱", "幣別","現有金額", "收入", "支出", "存款", "提款", "轉入", "轉出", "手續費", "定存"]

    const user_id = useSelector(selectCurrentUserId);

    const {
        data: banks,
        isLoading: bankIsLoading,
        isSuccess: bankIsSuccess,
    } = useGetBankQuery({user_id});
    const {
        data:record,
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
    const{
        data:userCurrency,
        isLoading: iserCurIsLoading,
        isSuccess: userCurIsSuccess,
    } = useGetUserCurrencyQuery({ user_id })
    const phraseMap = {
        banks:{},
        currency:{
            "TWD":"台幣"
        }
    }
    const bankData = {};
    let tableContent;
    if(bankIsLoading || recIsLoading || finIsLoading || tiSumIsLoading){
        tableContent = <tr><td>Loading. . .</td></tr>
    }
    else if(bankIsSuccess && recIsSuccess && finIsSuccess && tiSumIsSuccess && userCurIsSuccess){
        userCurrency.forEach(element => phraseMap['currency'][element.code] = element.name);
        banks.forEach(element => {
            bankData[element['bank_id']] = { // create the data for each bank
                amount: element['initialAmount'],
                currency: phraseMap["currency"][element['currency']],
                income: 0,
                expenditure: 0,
                deposit: 0,
                withdraw: 0,
                transfer_in: 0,
                transfer_out: 0,
                charge:0,
                time_deposit: 0
            }
            phraseMap["banks"][element['bank_id']] = element['name'];
        });
        banks.forEach(bank => {
            const result = JSON.parse(record[bank['bank_id']]?.result ?? "[]").reduce((acc, obj) => { // This function turn array of json to one json object
                const key = Object.keys(obj)[0];
                acc[key] = obj[key];
                return acc;
            }, {});
            bankData[bank['bank_id']]['income'] +=  (finRecord[bank['bank_id']]?.['inSum'] ?? 0) + (tiSum[bank['bank_id']]?.['intTot'] ?? 0);// int-Interest
            bankData[bank['bank_id']]['expenditure'] += (finRecord[bank['bank_id']]?.['expSum'] ?? 0);
            bankData[bank['bank_id']]['charge'] += (record[bank['bank_id']]?.charge ?? 0);
            bankData[bank['bank_id']]['time_deposit'] += (tiSum[bank['bank_id']]?.['amoTot'] ?? 0);
            Object.keys(result).forEach(key => { bankData[bank['bank_id']][key] += result[key];}) // add the value to each bank
            // have to add a documentation about how to value been calculated.
            bankData[bank['bank_id']]["amount"] += bankData[bank['bank_id']]["income"] + bankData[bank['bank_id']]["deposit"] + bankData[bank['bank_id']]["transfer_in"] -
            bankData[bank['bank_id']]["expenditure"] - bankData[bank['bank_id']]["withdraw"] - bankData[bank['bank_id']]["transfer_out"] - bankData[bank['bank_id']]['charge'] - (tiSum[bank['bank_id']]?.['amoTot'] ?? 0);  // amoTot-amountTot
        })
        tableContent = banks.map((item) => { return (
            <tr key={item.bank_id}>
                <td className="table-data-cell" >{[[phraseMap['banks'][item.bank_id]]]}</td>   
                {
                    values.map(value => <td className="table-data-cell number" value={value} key={value}>{bankData[item.bank_id][value]}</td>)
                }
            </tr>
        )})
    }

    return(
        <>
            <PageLabel title={"金融機構:總覽"}/>
            <div className="dash-bank-container">
                <div className="dash-bank-content">
                    <div className="table-container">
                        <DetailTable 
                            titles={titles}
                            tableContent={tableContent}
                        />
                    </div>
                    <FormBank userCurrency={{isSuccess: userCurIsSuccess, data: userCurrency}}/>
                </div>
            </div>
        </>
    )
}

export default DashboardBank;

