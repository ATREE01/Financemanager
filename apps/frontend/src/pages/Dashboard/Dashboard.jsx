import { Chart } from "react-google-charts";

import PageLabel from "./../../components/PageLabel/PageLabel.jsx";

import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../features/Auth/AuthSlice.jsx";
import { useGetBankAreaChartDataQuery, useGetBankDataQuery, useGetInvtAreaChartDataQuery, useGetInvtDataQuery } from "../../features/Dashboard/DashboardApiSlice.jsx";
import { useGetBankQuery } from "../../features/Bank/BankApiSlice.jsx";
import { useGetBrokerageQuery } from "../../features/Invt/InvtApiSlice.jsx";

export default function User(){

    const pieChartOptions = {
        legend:{position:'top', maxLines:3},
        pieSliceText:"percentage",
        backgroundColor: 'transparent'
    };

    const areaGraphoptions = {
        isStacked: true,
        height: 300,
        legend: { position: "top", maxLines: 3 },
        vAxis: { minValue: 0 },
        backgroundColor: 'transparent'
    };

    const phraseMap = {
        bank: {},
        brokerage: {}
    }

    const user_id = useSelector(selectCurrentUserId);

    const {
        data:bank,
        isLoading: bankIsLoading,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({ user_id });

    const {
        data: bankData,
        isLoading: bankDataIsLoading,
        isSuccess: bankDataIsSuccess
    } = useGetBankDataQuery({ user_id });

    const {
        data: brokerage,
        isLoading: brkgIsLoading,
        isSuccess: brkgIsSuccess
    } = useGetBrokerageQuery({ user_id });

    const {
        data: invtData,
        isLoading: invtDataIsLoading,
        isSuccess: invtDataIsSuccess
    } = useGetInvtDataQuery({ user_id });

    const {
        data: bankAreaChartData,
        isLoading: bankAreaChartDataIsLoading,
        isSuccess: bankAreaChartDataIsSuccess
    } = useGetBankAreaChartDataQuery({ user_id });

    const {
        data: invtAreaChartData,
        isLoading: invtAreaChartDataIsLoading,
        isSuccess: invtAreaChartDataIsSuccess
    } = useGetInvtAreaChartDataQuery({ user_id });

    let bankChartData = [["bank", "amount"]], invtChartData = [["brokerage", 'amount']], totalChartData = [["caregory", "amount"]], totalAreaChartData =[['date', '銀行', '投資']];
    let pageContent;
    if(bankIsLoading || bankDataIsLoading  || brkgIsLoading || invtDataIsLoading || bankAreaChartDataIsLoading && invtAreaChartDataIsLoading){
        pageContent =
        <div className="w-full h-[70vh] flex items-center justify-center">
            <div
                class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
            ></div>
        </div>
    }
    else if(bankIsSuccess && bankDataIsSuccess  && brkgIsSuccess && invtDataIsSuccess && bankAreaChartDataIsSuccess && invtAreaChartDataIsSuccess){
        let bankTotal = 0, invtTotal = 0;
        bank.forEach( element => phraseMap['bank'][element.bank_id] = element.name);
        Object.keys(bankData).forEach( key => {bankChartData.push([phraseMap['bank'][key], (bankData[key] > 0 ? bankData[key] : 0)]); bankTotal += bankData[key] > 0 ? bankData[key] : 0})
        totalChartData.push(["金融機構", bankTotal]);

        brokerage.forEach( element => phraseMap['brokerage'][element.brokerage_id] = element.name);
        invtData.forEach( element => {invtChartData.push([phraseMap['brokerage'][element.brokerage_id], element.total_amount]); invtTotal += element.total_amount});
        totalChartData.push(["投資", invtTotal]);
        
        const map = new Map(invtAreaChartData.slice(1));
        bankAreaChartData.slice(1, -1).forEach( ([date, amount]) => {
            const invtValue = map.get(date) ?? 0;
            totalAreaChartData.push([date, amount, invtValue]);
        })
        pageContent = 
        <>
            <div className="pie-chart-container flex flex-wrap justify-center mb-4 text-center">
                <div className='pie-chart-block w-80 h-80'>
                    <div className='text-3xl font-bold'>財產總覽</div>
                    <Chart 
                        chartType="PieChart"
                        data={totalChartData}
                        options={pieChartOptions}
                        width={"20rem"}
                        height={"20rem"}
                    />
                </div>
                <div className='DIE-pie-chart-block w-80 h-80'>
                    <div className='text-3xl font-bold '>金融總覽</div>
                    <Chart
                        chartType="PieChart"
                        data={bankChartData}
                        options={pieChartOptions}
                        width={"20rem"}
                        height={"20rem"}
                    />
                </div>
                <div className='DIE-pie-chart-block w-80 h-80'>
                    <div className='text-3xl font-bold'>投資總覽</div>
                    <Chart
                        chartType="PieChart"
                        data={invtChartData}
                        options={pieChartOptions}
                        width={"20rem"}
                        height={"20rem"}
                    />
                </div>
            </div>
            <div className="area-chart-container flex flex-wrap justify-center m-4 text-center">
                <div className='pie-chart-block w-96 h-80'>
                    <div className='text-3xl font-bold'>總資產變化圖</div>
                    <Chart 
                        chartType="AreaChart"
                        data={totalAreaChartData}
                        options={areaGraphoptions}
                        width={"25rem"}
                        height={"20rem"}
                    />
                </div>
                <div className='pie-chart-block w-96 h-80'>
                    <div className='text-3xl font-bold'>股票市值變化圖</div>
                    <Chart 
                        chartType="AreaChart"
                        data={invtAreaChartData}
                        options={areaGraphoptions}
                        width={"25rem"}
                        height={"20rem"}
                    />
                </div>
                <div className='pie-chart-block w-96 h-80'>
                    <div className='text-3xl font-bold'>銀行資產變化圖</div>
                    <Chart 
                        chartType="AreaChart"
                        data={bankAreaChartData}
                        options={areaGraphoptions}
                        width={"25rem"}
                        height={"20rem"}
                    />
                </div>
            </div>
        </>
    }
    
    return (
        <div className="bg-slate-100 py-5 min-h-screen">
            <PageLabel title="總覽"/>
            { pageContent }
        </div>
    );
}
