import "./DashboardIncExp.css";
import '../Inc_Exp.css';
import { useState } from 'react';
import { Chart } from "react-google-charts";

import { useGetRecordSumQuery, useGetCategoryQuery } from '../../../features/IncExp/IncExpApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';
import PageLabel from '../../../components/PageLabel/PageLabel';
import FormIncExp from "../FormIncExp/FormIncExp";

const DashboardIncExp = () => {
    const [currency, setCurrency] = useState('TWD');
    const [duration, setDuration] = useState("default");
    
    const phraseMap = {
        category:{
        }
    }
    const IncSumData = [
        ["Category", "amount"],
    ];

    const ExpSumData = [
        ["Category", "amount"],
    ];
    
    const pieChartOptions = {
        legend:{position:'top', maxLines:3},
        pieSliceText:"percentage"
    };

    const user_id = useSelector(selectCurrentUserId);

    const {
        data: categoryData,
        isSuccess: catIsSuccess
    } = useGetCategoryQuery();

    const {
        data: recordSum,
        isSuccess: isRecSumSuccess
    } = useGetRecordSumQuery({user_id, duration})

    if(catIsSuccess){
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
        <>
            <PageLabel title={"收支紀錄:總覽"}/>
            <div className='Dash-IE-container'>
                <div className='Dash-IE-content'>
                    <div className='currency-options-container'>
                        <div className={`currency-option ${currency === "TWD" ? "selected" : ""}`} onClick={() => setCurrency("TWD")}>台幣</div>
                        <div className='currency-option' >外幣
                            {/* TODO: this element should be a drop down*/}
                        </div>
                    </div>

                    <div className='duration-options-container'>
                        <div className={`duration-option ${duration === "default" ? "selected" : ""}`} onClick={() => setDuration("default")}>不限</div>
                        <div className={`duration-option ${duration === "week" ? "selected" : ""}`} onClick={() => setDuration("week")}>近一周</div>
                        <div className={`duration-option ${duration === "month" ? "selected" : ""}`} onClick={() => setDuration("month")} >近一個月</div>
                        <div className={`duration-option ${duration === "3month" ? "selected" : ""}`} onClick={() => setDuration("3month")}>近三個月</div>
                        <div className={`duration-option ${duration === "YTD" ? "selected" : ""}`} onClick={() => setDuration("YTD")}>今年至今</div>
                        <div className={`duration-option ${duration === "other" ? "selected" : ""}`}>自訂</div>
                    </div>

                    <div className='Dash-IE-pie-chart-container'>
                        <div className='DIE-pie-chart-block'>
                            <div className='pie-chart-title'>收入</div>
                            <Chart 
                                chartType="PieChart"
                                data={IncSumData}
                                options={pieChartOptions}
                                width={"25rem"}
                                height={"50vh"}
                            />
                        </div>
                        <div className='DIE-pie-chart-block'>
                            <div className='pie-chart-title'>支出</div>
                            <Chart
                                chartType="PieChart"
                                data={ExpSumData}
                                options={pieChartOptions}
                                width={"25rem"}
                                height={"50vh"}
                            />
                        </div>
                    </div>

                    <FormIncExp currency={currency}/>
                </div>
            </div>
        </>
    )
}

export default DashboardIncExp;