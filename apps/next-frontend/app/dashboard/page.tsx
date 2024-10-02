"use client";

import Chart from "react-google-charts";

import PageLabel from "@/app/components/page-label";
import { useBankSummary } from "@/lib/features/Bank/BankSlice";
import { useBrokerageFirmSummary } from "@/lib/features/BrokerageFirm/BrokerageFirmSlice";

export default function Dashboard() {
  const pieChartOptions = {
    legend: { position: "top", maxLines: 3 },
    pieSliceText: "percentage",
    backgroundColor: "transparent",
  };

  // const areaGraphoptions = {
  //     isStacked: true,
  //     height: 300,
  //     legend: { position: "top", maxLines: 3 },
  //     vAxis: { minValue: 0 },
  //     backgroundColor: 'transparent'
  // };

  const bankSummary = useBankSummary();
  const brokerageFirmSummary = useBrokerageFirmSummary();

  let bankTotal = 0,
    brokerageFirmTotal = 0;

  const bankPieChartData = [
    ["bank", "value"],
    ...Object.entries(bankSummary).map(([key, summary]) => {
      bankTotal += summary.value;
      return [key, summary.value];
    }),
  ];
  const brokerageFirmPieChartData = [
    ["brokerageFirm", "value"],
    ...Object.entries(brokerageFirmSummary).map(([key, summary]) => {
      brokerageFirmTotal += summary.value;
      return [key, summary.value];
    }),
  ];
  const totalPieChartData = [
    ["caregory", "amount"],
    ["銀行", bankTotal],
    ["券商", brokerageFirmTotal],
  ];

  return (
    <main>
      <div className="bg-slate-100 py-[--navbar-height] min-h-screen">
        <PageLabel title="總覽" />

        <div className="pie-chart-container flex flex-wrap justify-center mb-4 text-center text-black">
          <div className="pie-chart-block w-80 h-80">
            <div className="text-3xl font-bold">財產總覽</div>
            <Chart
              chartType="PieChart"
              data={totalPieChartData}
              options={pieChartOptions}
              width={"20rem"}
              height={"20rem"}
            />
          </div>
          <div className="DIE-pie-chart-block w-80 h-80">
            <div className="text-3xl font-bold">金融總覽</div>
            <Chart
              chartType="PieChart"
              data={bankPieChartData}
              options={pieChartOptions}
              width={"20rem"}
              height={"20rem"}
            />
          </div>
          <div className="DIE-pie-chart-block w-80 h-80">
            <div className="text-3xl font-bold">投資總覽</div>
            <Chart
              chartType="PieChart"
              data={brokerageFirmPieChartData}
              options={pieChartOptions}
              width={"20rem"}
              height={"20rem"}
            />
          </div>
        </div>
        <div className="area-chart-container flex flex-wrap justify-center m-2 text-center">
          {/* <div className='pie-chart-block w-96 h-80'>
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
                    </div> */}
        </div>
      </div>
    </main>
  );
}
