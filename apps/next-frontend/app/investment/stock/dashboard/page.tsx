"use client";

import type {
  CreateStockSellRecord,
  StockRecordSummarySell,
} from "@financemanager/financemanager-website-types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import * as React from "react";

import DetailTable from "@/app/components/detail-table";
import StockFormManager from "@/app/components/forms/stock-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import SummaryCard from "@/app/components/summary-card";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { useGetStockSummaryQuery } from "@/lib/features/stock/StockApiSlice";

/* 
  這邊所計算的報酬率當中都不包含手續費或是稅金
*/

export default function Deashboard() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const normalTableTitles = [
    "券商",
    "幣別",
    "股票名稱",
    "平均成本",
    "持有股數",
    "持有成本",
    "參考股價",
    "參考市值",
    "已實現損益",
    "未實現損益",
    "功能",
  ];
  const baseSubTableTitles = [
    "交易股價",
    "持有股數",
    "持有成本",
    "市值",
    "已實現損益",
    "未實現損益",
  ];
  const activateSubTableTitles = [
    "選取",
    "賣出股數",
    "交易股價",
    "持有股數",
    "持有成本",
    "市值",
    "已實現損益",
    "未實現損益",
  ];

  const exchnageTableTitles = [
    "券商",
    "交易幣別",
    "交割幣別",
    "股票名稱",
    "平均成本",
    "持有股數",
    "總成本(易)",
    "總成本(割)",
    "參考股價",
    "參考市值(易)",
    "已實現損益(割)",
    "未實現損益(割)",
    "未實現損益(易)",
    "功能",
  ];

  const [expandedIdx, setExpandedIdx] = useState(-1);
  const [sellIdx, setSellIdx] = useState(-1);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [totalSellShares, setTotalSellShare] = useState(0);
  const [stockRecordSummarySell, setStockRecordSellShare] =
    useState<StockRecordSummarySell>({
      brokerageFirm: null,
      userStockId: null,
      stockRecordSellShare: {},
    });

  const [bundleSellShowState, setBundleSellShowState] = useState(false);

  const { data: stockSummaries = [], isLoading: stockSummariesIsLoading } =
    useGetStockSummaryQuery();

  const investmentSummary = useMemo(() => {
    let totalInvestment = 0;
    let currentMarketValue = 0;
    let totalUnrealizedGain = 0;

    stockSummaries.forEach((summary) => {
      totalInvestment += summary.totalSettlementCost;
      currentMarketValue +=
        summary.totalShare *
        summary.userStock.stock.close *
        summary.brokerageFirm.transactionCurrency.exchangeRate;
      totalUnrealizedGain +=
        summary.totalShare *
          summary.userStock.stock.close *
          summary.brokerageFirm.transactionCurrency.exchangeRate -
        summary.totalSettlementCost;
    });

    return {
      totalInvestment,
      currentMarketValue,
      totalUnrealizedGain,
      unrealizedGainPercentage:
        totalInvestment === 0
          ? 0
          : (totalUnrealizedGain / totalInvestment) * 100,
    };
  }, [stockSummaries]);

  useEffect(() => {
    setTotalSellShare(
      Object.values(stockRecordSummarySell.stockRecordSellShare).reduce(
        (acc: number, curr: CreateStockSellRecord) => acc + curr.shareNumber,
        0,
      ),
    );
  }, [stockRecordSummarySell]);

  if (!stockSummaries || stockSummariesIsLoading) return <LoadingPage />;

  function handleSubTableExpand(index: number) {
    setExpandedIdx(expandedIdx === index ? -1 : index);
    setSellIdx(-1);
    if (expandedIdx === -1) {
      setStockRecordSellShare({
        brokerageFirm: null,
        userStockId: null,
        stockRecordSellShare: {},
      });
      setCheckedItems({});
    }
  }

  function handleSellOnClick(index: number) {
    setExpandedIdx(index);
    setSellIdx(index);
    if (sellIdx === -1) {
      setStockRecordSellShare({
        brokerageFirm: stockSummaries[index].brokerageFirm,
        userStockId: stockSummaries[index].userStock.id,
        stockRecordSellShare: {},
      });
      setCheckedItems({});
    }
  }

  function handleCheckboxChange(index: number, id: number) {
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  }

  function handleCancleOnClick() {
    setSellIdx(-1);
    setStockRecordSellShare({
      brokerageFirm: null,
      userStockId: null,
      stockRecordSellShare: {},
    });
    setCheckedItems({});
  }

  function handleShareNumberBlur(
    event: React.FocusEvent<HTMLInputElement>,
    index: number,
    shareNumber: number,
  ) {
    const value = Number(event.target.value);
    if (value === 0) {
      checkedItems[index] = false;
      event.target.value = "";
    } else if (value > shareNumber) {
      event.target.value = Number(shareNumber).toString();
    }
    setStockRecordSellShare((prevState) => ({
      ...prevState,
      stockRecordSellShare: {
        ...prevState.stockRecordSellShare,
        [index]: { shareNumber: Number(event.target.value) },
      },
    }));
  }

  function handleShareNumberKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  }

  const normalTableContents: React.ReactNode[] = [];
  const exchangeTableContents: React.ReactNode[] = [];

  stockSummaries.forEach((stockSummary, index: number) => {
    const traMarketValue =
      stockSummary.totalShare * stockSummary.userStock.stock.close; // market value in transaction currency
    const setMarketValue =
      traMarketValue *
      stockSummary.brokerageFirm.transactionCurrency.exchangeRate; // market value in settlement currency

    const isExchange =
      stockSummary.brokerageFirm.settlementCurrency.id !==
      stockSummary.brokerageFirm.transactionCurrency.id;

    const content = (
      <React.Fragment key={index}>
        <tr className="border-b hover:bg-gray-100">
          <td className="table-data-cell">{stockSummary.brokerageFirm.name}</td>
          <td className="table-data-cell">
            {stockSummary.brokerageFirm.transactionCurrency.name}
          </td>
          {isExchange && (
            <td className="table-data-cell">
              {stockSummary.brokerageFirm.settlementCurrency.name}
            </td>
          )}
          <td className="table-data-cell">{stockSummary.userStock.name}</td>
          <td className="table-data-cell">
            {stockSummary.averageBuyPrice.toFixed(2)}
          </td>
          <td className="table-data-cell">
            {Number(Number(stockSummary.totalShare).toFixed(5))}
          </td>
          <td className="table-data-cell">
            {Number(stockSummary.totalTransactionCost).toFixed(2)}
          </td>
          {isExchange && (
            <td className="table-data-cell">
              {Number(stockSummary.totalSettlementCost).toFixed(2)}
            </td>
          )}
          <td className="table-data-cell">
            {Number(stockSummary.userStock.stock.close).toFixed(2)}
          </td>
          <td className="table-data-cell">
            {Number(setMarketValue).toFixed(2)}
          </td>
          <td className="table-data-cell">
            {Number(stockSummary.realizedGain).toFixed()}(
            {stockSummary.totalSoldCost !== 0
              ? Number(
                  (stockSummary.realizedGain / stockSummary.totalSoldCost) *
                    100,
                ).toFixed(1)
              : 0}
            %)
          </td>
          <td className="table-data-cell">
            {Number(
              setMarketValue - stockSummary.totalSettlementCost,
            ).toFixed()}
            (
            {stockSummary.totalSettlementCost !== 0
              ? Number(
                  (setMarketValue / stockSummary.totalSettlementCost - 1) * 100,
                ).toFixed(1)
              : 0}
            %)
          </td>
          {isExchange && (
            <td className="table-data-cell">
              {Number(
                traMarketValue - stockSummary.totalTransactionCost,
              ).toFixed(1)}
              (
              {stockSummary.totalSettlementCost !== 0
                ? Number(
                    (traMarketValue / stockSummary.totalTransactionCost - 1) *
                      100,
                  ).toFixed(2)
                : 0}
              %)
            </td>
          )}
          <td className="table-data-cell">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition-colors mx-1"
              onClick={() => handleSubTableExpand(index)}
            >
              詳細
            </button>
            <button
              className="bg-red-400 hover:bg-red-600  text-white py-1 px-3 rounded transition-colors mx-1"
              onClick={() => handleSellOnClick(index)}
            >
              賣出
            </button>
          </td>
        </tr>

        {/* sub form */}
        {expandedIdx === index && (
          <tr>
            {isExchange && <td colSpan={3}></td>}
            <td colSpan={isExchange ? 10 : 11}>
              <DetailTable
                titles={
                  sellIdx === index
                    ? activateSubTableTitles
                    : baseSubTableTitles
                }
                titleColor="bg-green-400"
                tableContent={
                  <>
                    {stockSummary.stockRecordSummaries.map(
                      (stockRecordSummary) => {
                        const transactionCost =
                          stockRecordSummary.buyPrice *
                          stockRecordSummary.shareNumber;
                        const marketValue =
                          stockSummary.userStock.stock.close *
                          stockRecordSummary.shareNumber;
                        return (
                          <tr
                            key={stockRecordSummary.id}
                            className="border-b hover:bg-gray-100"
                          >
                            {sellIdx === index && (
                              <>
                                <td className="table-data-cell w-4">
                                  {sellIdx === index &&
                                    stockRecordSummary.shareNumber > 0 && (
                                      <input
                                        type="checkbox"
                                        checked={
                                          checkedItems[stockRecordSummary.id] ??
                                          false
                                        }
                                        onChange={() =>
                                          handleCheckboxChange(
                                            index,
                                            stockRecordSummary.id,
                                          )
                                        }
                                      />
                                    )}
                                </td>
                                <td className="table-data-cell w-10 px-1">
                                  {checkedItems[stockRecordSummary.id] && (
                                    <input
                                      placeholder="股數"
                                      className="w-full border-b-2 text-center rounded-md"
                                      onBlur={(event) =>
                                        handleShareNumberBlur(
                                          event,
                                          stockRecordSummary.id,
                                          stockRecordSummary.shareNumber,
                                        )
                                      }
                                      onKeyDown={(event) =>
                                        handleShareNumberKeyDown(event)
                                      }
                                    />
                                  )}
                                </td>
                              </>
                            )}
                            <td className="table-data-cell">
                              {Number(stockRecordSummary.buyPrice)}
                            </td>
                            <td className="table-data-cell">
                              {Number(stockRecordSummary.shareNumber)}
                            </td>
                            <td className="table-data-cell">
                              {Number(transactionCost).toFixed(1)}
                            </td>
                            <td className="table-data-cell">
                              {Number(marketValue).toFixed(1)}
                            </td>
                            <td className="table-data-cell">
                              {Number(
                                stockRecordSummary.realizedGain,
                              ).toFixed()}
                              (
                              {stockRecordSummary.totalSoldCost !== 0
                                ? Number(
                                    (stockRecordSummary.realizedGain /
                                      stockRecordSummary.totalSoldCost) *
                                      100,
                                  ).toFixed(1)
                                : 0}
                              %)
                            </td>
                            <td className="table-data-cell">
                              {Number(marketValue - transactionCost).toFixed(1)}
                              (
                              {transactionCost !== 0
                                ? Number(
                                    (marketValue / transactionCost - 1) * 100,
                                  ).toFixed(1)
                                : 0}
                              %)
                            </td>
                          </tr>
                        );
                      },
                    )}
                    {sellIdx === index && (
                      <tr key="confirm-sell">
                        <td colSpan={8} className="table-data-cell text-right">
                          <div className="flex justify-end items-center space-x-4">
                            {/* Displaying total shares to sell */}
                            <span className="font-bold">總股數:</span>
                            <span className="border-b-2 px-2 text-lg ">
                              {totalSellShares}
                            </span>
                            {/* Cancel button */}
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors mx-1"
                              onClick={handleCancleOnClick}
                            >
                              取消
                            </button>

                            {/* Confirm button */}
                            <button
                              className="bg-green-500 enabled:hover:bg-green-600 disabled:bg-slate-800 text-white py-1 px-3 rounded transition-colors mx-1"
                              disabled={totalSellShares === 0}
                              onClick={() =>
                                setBundleSellShowState(!bundleSellShowState)
                              }
                            >
                              確認
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                }
              />
            </td>
          </tr>
        )}
      </React.Fragment>
    );

    if (isExchange) exchangeTableContents.push(content);
    else normalTableContents.push(content);
  });

  return (
    <main className="pt-[--navbar-height]">
      <PageLabel title="股票總覽" />
      <div className="p-4 flex flex-col justify-start items-center">
        <div className="w-[90vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="總投資"
            className=" border-blue-200 text-blue-700"
            value={investmentSummary.totalInvestment.toFixed(2)}
          />
          <SummaryCard
            title="當前市值"
            className="border-yellow-200 text-yellow-700"
            value={investmentSummary.currentMarketValue.toFixed(2)}
          />
          <SummaryCard
            title="未實現損益"
            value={investmentSummary.totalUnrealizedGain.toFixed(2)}
            percentage={investmentSummary.unrealizedGainPercentage}
            className={
              investmentSummary.totalUnrealizedGain >= 0
                ? "bg-red-100 border border-red-200 text-red-700"
                : "bg-green-100 border border-green-200 text-green-700"
            }
          />
        </div>
        <div className="flex justify-center p-2">
          <div className="w-[90vw] h-[80vh]">
            <div className="overflow-auto mb-4">
              <DetailTable
                titles={normalTableTitles}
                tableContent={normalTableContents}
              />
            </div>
            <div className="overflow-auto mb-4">
              <DetailTable
                titles={exchnageTableTitles}
                tableContent={exchangeTableContents}
              />
            </div>
          </div>

          <StockFormManager
            updateStockRecordShowState={null}
            updateBundleSellShowState={null}
            updateStockSellShowState={null}
            bundleSellShowState={{
              isShow: bundleSellShowState,
              setShow: setBundleSellShowState,
            }}
            stockRecordSummarySell={stockRecordSummarySell}
          />
        </div>
      </div>
    </main>
  );
}
