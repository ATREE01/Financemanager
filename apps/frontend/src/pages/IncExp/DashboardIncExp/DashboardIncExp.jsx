import '../Inc_Exp.css';
import { useState } from 'react';
import { Chart } from "react-google-charts";

import { useGetRecordSumQuery, useGetCategoryQuery } from '../../../features/IncExp/IncExpApiSlice';
import { useGetUserCurrencyQuery } from "../../../features/Currency/CurrencyApiSlice";
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';

import PageLabel from '../../../components/PageLabel/PageLabel';
import FormIncExp from "../FormIncExp/FormIncExp";
import CurrencyOption from "./CurrencyOption";
import DurationOption from "../DurationOption";
import { useGetBankQuery } from "../../../features/Bank/BankApiSlice";

const DashboardIncExp = () => {

    const pieChartOptions = {
        legend:{position:'top', maxLines:3},
        pieSliceText:"percentage",
        backgroundColor: 'transparent'
    };

    const [ currency, setCurrency ] = useState('TWD');
    const [ duration, setDuration ] = useState("default");
    const [ startDate, setStartDate ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    
    const phraseMap = {
        category:{
        },
        currency:{
        }
    }
    const IncSumData = [
        ["Category", "amount"],
    ];

    const ExpSumData = [
        ["Category", "amount"],
    ];
    
    const user_id = useSelector(selectCurrentUserId);

    const {
        data: categoryData,
        isSuccess: catIsSuccess
    } = useGetCategoryQuery({ user_id });

    const {
        data: recordSum,
        isSuccess: isRecSumSuccess
    } = useGetRecordSumQuery({ user_id, duration, startDate, endDate, currency })

    const {
        data: userCurrency,
        isLoading: userCurIsLoading,
        isSuccess: userCurIsSuccess,
    } = useGetUserCurrencyQuery({ user_id })

    const {
        data: bank,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({ user_id })

    let CurrencyContent ;
    if( catIsSuccess && userCurIsSuccess){
        //  Currency List
        userCurrency.forEach(element => {phraseMap['currency'][element.code] = element.name;})
        CurrencyContent = <CurrencyOption data={phraseMap['currency']} setCurrency={setCurrency}/>
        
        categoryData.IncomeCategoryData.forEach(element => {phraseMap['category'][element.value] = element.name})
        categoryData.ExpenditureCategoryData.forEach(element => {phraseMap['category'][element.value] = element.name})
    }

    if(isRecSumSuccess){
        recordSum.incSum.forEach(element => {
            IncSumData.push([phraseMap['category'][element['category']], element['SUM(amount)']]);
        })
        recordSum.expSum.forEach(element => {
            ExpSumData.push([phraseMap['category'][element['category']], element['SUM(amount)']]);
        })
    }

    return(
        <div className="bg-slate-100 py-5 min-h-screen">
            <PageLabel title={"收支紀錄:總覽"}/>
            <div className='Dash-IE-container'>
                <div className='Dash-IE-content w-full flex flex-col items-center'>
                    <div className='currency-options-container'>
                        <div className='currency-option w-40 h-12' >
                            {CurrencyContent}
                        </div>
                    </div>

                    <DurationOption Duration={{data: duration, setData: setDuration}} startDate={{data: startDate, setData: setStartDate}} endDate={{data: endDate, setData:setEndDate}} />

                    <div className='pie-chart-container flex flex-wrap justify-center m-4 text-center'>
                        <div className='DIE-pie-chart-block w-96 h-[50vh]'>
                            <div className='text-3xl font-bold text-center'>收入</div>
                            <Chart 
                                chartType="PieChart"
                                data={IncSumData}
                                options={pieChartOptions}
                                width={"25rem"}
                                height={"50vh"}
                            />
                        </div>
                        <div className='DIE-pie-chart-block w-96 h-[50vh]'>
                            <div className='text-3xl font-bold text-center'>支出</div>
                            <Chart
                                chartType="PieChart"
                                data={ExpSumData}
                                options={pieChartOptions}
                                width={"25rem"}
                                height={"50vh"}
                            />
                        </div>
                    </div>
                    <FormIncExp currency={currency} userCurrency={{isSuccess:userCurIsSuccess, data:userCurrency}} category={{data: categoryData, isSuccess:catIsSuccess}} bank={{data: bank, isSuccess:bankIsSuccess}}/>
                </div>
            </div>
        </div>
    )
}

export default DashboardIncExp;