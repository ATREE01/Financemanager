"use client";

import type {
  BrokerageFirm,
  CreateStockSellRecord,
  StockRecordSummarySell,
  UserStock,
} from "@financemanager/financemanager-website-types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as React from "react";

import { DataTable } from "@/app/components/data-table";
import StockFormManager from "@/app/components/forms/stock-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import PieChartCard from "@/app/components/pie-chart-card";
import SummaryCard from "@/app/components/summary-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { useGetStockSummaryQuery } from "@/lib/features/stock/StockApiSlice";

export interface StockRecordSummary {
  id: number;
  buyPrice: number;
  shareNumber: number;
  totalSoldCost: number;
  realizedGain: number;
}

export interface StockSummary {
  brokerageFirm: BrokerageFirm;
  userStock: UserStock;
  averageBuyPrice: number;
  totalShare: number;
  totalTransactionCost: number;
  totalSettlementCost: number;
  realizedGain: number;
  totalSoldCost: number;
  stockRecordSummaries: StockRecordSummary[];
}

export default function Deashboard() {
  const userId = useUserId();
  const router = useRouter();
  useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const [sellIdx, setSellIdx] = useState<number>(-1);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [totalSellShares, setTotalSellShare] = useState<number>(0);
  const [stockRecordSummarySell, setStockRecordSellShare] =
    useState<StockRecordSummarySell>({
      brokerageFirm: null,
      userStockId: null,
      stockRecordSellShare: {},
    });

  const [bundleSellShowState, setBundleSellShowState] = useState(false);

  const { data: stockSummariesRaw = [], isLoading: stockSummariesIsLoading } =
    useGetStockSummaryQuery();

  // 排序資料，例如依據市值降序排列
  const stockSummaries = useMemo(() => {
    return stockSummariesRaw.map((summary) => ({
      ...summary,
      stockRecordSummaries: [...summary.stockRecordSummaries].sort(
        (a, b) => b.buyPrice - a.buyPrice,
      ),
    }));
  }, [stockSummariesRaw]);

  const investmentSummary = useMemo(() => {
    let totalInvestment = 0;
    let currentMarketValue = 0;
    let totalUnrealizedGain = 0;
    const portfolioAllocation: (string | number)[][] = [
      ["Stock", "Market Value"],
    ];

    stockSummaries.forEach((summary: StockSummary) => {
      totalInvestment += summary.totalSettlementCost;
      const marketVal =
        summary.totalShare *
        summary.userStock.stock.close *
        summary.brokerageFirm.transactionCurrency.exchangeRate;
      currentMarketValue += marketVal;

      if (marketVal > 0) {
        portfolioAllocation.push([
          summary.userStock.name,
          Number(marketVal.toFixed(2)),
        ]);
      }

      totalUnrealizedGain += marketVal - summary.totalSettlementCost;
    });

    return {
      totalInvestment,
      currentMarketValue,
      totalUnrealizedGain,
      unrealizedGainPercentage:
        totalInvestment === 0
          ? 0
          : (totalUnrealizedGain / totalInvestment) * 100,
      portfolioAllocation,
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

  const resetSellState = useCallback(() => {
    setSellIdx(-1);
    setStockRecordSellShare({
      brokerageFirm: null,
      userStockId: null,
      stockRecordSellShare: {},
    });
    setCheckedItems({});
  }, []);

  const handleCancelOnClick = useCallback(
    (row: Row<StockSummary>) => {
      resetSellState();
      if (row.getIsExpanded()) {
        row.toggleExpanded();
      }
    },
    [resetSellState],
  );

  // 2. 更新按鈕點擊邏輯，第二次點擊會觸發取消並收起
  const handleSellOnClick = useCallback(
    (row: Row<StockSummary>) => {
      const summary = row.original;

      // 如果點擊的是目前已經展開的同一列，則執行取消邏輯並關閉
      if (sellIdx === row.index) {
        handleCancelOnClick(row);
        return;
      }

      if (sellIdx !== -1) {
        resetSellState();
      }

      setSellIdx(row.index);
      if (!row.getIsExpanded()) {
        row.toggleExpanded();
      }

      setStockRecordSellShare({
        brokerageFirm: summary.brokerageFirm,
        userStockId: summary.userStock.id,
        stockRecordSellShare: {},
      });
      setCheckedItems({});
    },
    [sellIdx, handleCancelOnClick, resetSellState],
  );

  const handleCheckboxChange = useCallback(
    (id: number, maxShareNumber?: number) => {
      setCheckedItems((prevState) => {
        const isChecked = !prevState[id];

        setStockRecordSellShare((prevStockState) => {
          if (isChecked && maxShareNumber !== undefined) {
            return {
              ...prevStockState,
              stockRecordSellShare: {
                ...prevStockState.stockRecordSellShare,
                [id]: { shareNumber: maxShareNumber },
              },
            };
          } else if (!isChecked) {
            const newState = {
              ...prevStockState,
              stockRecordSellShare: { ...prevStockState.stockRecordSellShare },
            };
            delete newState.stockRecordSellShare[id];
            return newState;
          }
          return prevStockState;
        });

        return {
          ...prevState,
          [id]: isChecked,
        };
      });
    },
    [],
  );

  const handleShareNumberBlur = useCallback(
    (
      event: React.FocusEvent<HTMLInputElement>,
      id: number,
      maxShareNumber: number,
    ) => {
      let value = Number(event.target.value);
      if (value <= 0) {
        handleCheckboxChange(id);
        event.target.value = "";
        return;
      } else if (value > maxShareNumber) {
        value = maxShareNumber;
        event.target.value = value.toString();
      }
      setStockRecordSellShare((prevState) => ({
        ...prevState,
        stockRecordSellShare: {
          ...prevState.stockRecordSellShare,
          [id]: { shareNumber: value },
        },
      }));
    },
    [handleCheckboxChange],
  );

  const normalColumns = useMemo<ColumnDef<StockSummary>[]>(
    () => [
      { accessorKey: "brokerageFirm.name", header: "券商" },
      { accessorKey: "brokerageFirm.transactionCurrency.name", header: "幣別" },
      {
        accessorKey: "userStock.name",
        header: "股票名稱",
        cell: ({ row }) => (
          <span className="font-bold">{row.original.userStock.name}</span>
        ),
      },
      {
        accessorKey: "averageBuyPrice",
        header: "平均成本",
        cell: ({ row }) => Number(row.original.averageBuyPrice).toFixed(2),
      },
      {
        accessorKey: "totalShare",
        header: "持有股數",
        cell: ({ row }) => (
          <span className="font-medium text-blue-600">
            {Number(row.original.totalShare).toFixed(5)}
          </span>
        ),
      },
      {
        accessorKey: "totalTransactionCost",
        header: "持有成本",
        cell: ({ row }) => Number(row.original.totalTransactionCost).toFixed(2),
      },
      {
        accessorKey: "userStock.stock.close",
        header: "參考股價",
        cell: ({ row }) =>
          Number(row.original.userStock.stock.close).toFixed(2),
      },
      {
        id: "marketValue",
        header: "參考市值",
        cell: ({ row }) => {
          const val =
            row.original.totalShare *
            row.original.userStock.stock.close *
            row.original.brokerageFirm.transactionCurrency.exchangeRate;
          return Number(val).toFixed(2);
        },
      },
      {
        id: "realizedGain",
        header: "已實現損益",
        cell: ({ row }) => {
          const val = row.original.realizedGain;
          const cost = row.original.totalSoldCost;
          const percentage = cost !== 0 ? (val / cost) * 100 : 0;
          return (
            <div
              className={
                val >= 0
                  ? "text-red-500 font-medium"
                  : "text-green-500 font-medium"
              }
            >
              {Number(val).toFixed()} ({percentage.toFixed(1)}%)
            </div>
          );
        },
      },
      {
        id: "unrealizedGain",
        header: "未實現損益",
        cell: ({ row }) => {
          const marketVal =
            row.original.totalShare *
            row.original.userStock.stock.close *
            row.original.brokerageFirm.transactionCurrency.exchangeRate;
          const val = marketVal - row.original.totalSettlementCost;
          const percentage =
            row.original.totalSettlementCost !== 0
              ? (marketVal / row.original.totalSettlementCost - 1) * 100
              : 0;
          return (
            <div
              className={
                val > 0
                  ? "text-red-500 font-medium"
                  : "text-green-500 font-medium"
              }
            >
              {Number(val).toFixed()} ({percentage.toFixed(1)}%)
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "功能",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleSellOnClick(row);
            }}
          >
            {sellIdx === row.index ? "取消賣出" : "賣出"}
          </Button>
        ),
      },
    ],
    [handleSellOnClick, sellIdx],
  );

  const exchangeColumns = useMemo<ColumnDef<StockSummary>[]>(
    () => [
      { accessorKey: "brokerageFirm.name", header: "券商" },
      {
        accessorKey: "brokerageFirm.transactionCurrency.name",
        header: "交易幣別",
      },
      {
        accessorKey: "brokerageFirm.settlementCurrency.name",
        header: "交割幣別",
      },
      {
        accessorKey: "userStock.name",
        header: "股票名稱",
        cell: ({ row }) => (
          <span className="font-bold">{row.original.userStock.name}</span>
        ),
      },
      {
        accessorKey: "averageBuyPrice",
        header: "平均成本",
        cell: ({ row }) => Number(row.original.averageBuyPrice).toFixed(2),
      },
      {
        accessorKey: "totalShare",
        header: "持有股數",
        cell: ({ row }) => (
          <span className="font-medium text-blue-600">
            {Number(row.original.totalShare).toFixed(5)}
          </span>
        ),
      },
      {
        accessorKey: "totalTransactionCost",
        header: "總成本(易)",
        cell: ({ row }) => Number(row.original.totalTransactionCost).toFixed(2),
      },
      {
        accessorKey: "totalSettlementCost",
        header: "總成本(割)",
        cell: ({ row }) => Number(row.original.totalSettlementCost).toFixed(2),
      },
      {
        accessorKey: "userStock.stock.close",
        header: "參考股價",
        cell: ({ row }) =>
          Number(row.original.userStock.stock.close).toFixed(2),
      },
      {
        id: "marketValueTra",
        header: "參考市值(易)",
        cell: ({ row }) => {
          const val =
            row.original.totalShare * row.original.userStock.stock.close;
          return Number(val).toFixed(2);
        },
      },
      {
        id: "realizedGain",
        header: "已實現損益(割)",
        cell: ({ row }) => {
          const val = row.original.realizedGain;
          const cost = row.original.totalSoldCost;
          const percentage = cost !== 0 ? (val / cost) * 100 : 0;
          return (
            <div
              className={
                val > 0
                  ? "text-red-500 font-medium"
                  : "text-green-500 font-medium"
              }
            >
              {Number(val).toFixed()} ({percentage.toFixed(1)}%)
            </div>
          );
        },
      },
      {
        id: "unrealizedGainSet",
        header: "未實現損益(割)",
        cell: ({ row }) => {
          const marketVal =
            row.original.totalShare *
            row.original.userStock.stock.close *
            row.original.brokerageFirm.transactionCurrency.exchangeRate;
          const val = marketVal - row.original.totalSettlementCost;
          const percentage =
            row.original.totalSettlementCost !== 0
              ? (marketVal / row.original.totalSettlementCost - 1) * 100
              : 0;
          return (
            <div
              className={
                val >= 0
                  ? "text-red-500 font-medium"
                  : "text-green-500 font-medium"
              }
            >
              {Number(val).toFixed()} ({percentage.toFixed(1)}%)
            </div>
          );
        },
      },
      {
        id: "unrealizedGainTra",
        header: "未實現損益(易)",
        cell: ({ row }) => {
          const marketVal =
            row.original.totalShare * row.original.userStock.stock.close;
          const val = marketVal - row.original.totalTransactionCost;
          const percentage =
            row.original.totalSettlementCost !== 0
              ? (marketVal / row.original.totalTransactionCost - 1) * 100
              : 0;
          return (
            <div
              className={
                val >= 0
                  ? "text-red-500 font-medium"
                  : "text-green-500 font-medium"
              }
            >
              {Number(val).toFixed(1)} ({percentage.toFixed(2)}%)
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "功能",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              handleSellOnClick(row);
            }}
          >
            {sellIdx === row.index ? "取消賣出" : "賣出"}
          </Button>
        ),
      },
    ],
    [handleSellOnClick, sellIdx],
  );

  const SubComponent = React.useCallback(
    ({ row }: { row: Row<StockSummary> }) => {
      const summary = row.original;
      const isSelling = sellIdx === row.index;

      return (
        <div className="bg-white rounded-lg shadow-inner border border-gray-200 p-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
            {isSelling ? "選擇欲賣出的購買批次" : "各批次購買明細"}
          </h4>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {isSelling && <th className="px-4 py-2">選取</th>}
                {isSelling && <th className="px-4 py-2">賣出股數</th>}
                <th className="px-4 py-2">交易股價</th>
                <th className="px-4 py-2">持有股數</th>
                <th className="px-4 py-2">持有成本</th>
                <th className="px-4 py-2">市值</th>
                <th className="px-4 py-2">已實現損益</th>
                <th className="px-4 py-2">未實現損益</th>
              </tr>
            </thead>
            <tbody>
              {summary.stockRecordSummaries.map(
                (record: StockRecordSummary) => {
                  const transactionCost = record.buyPrice * record.shareNumber;
                  const marketValue =
                    summary.userStock.stock.close * record.shareNumber;
                  const unrealizedGain = marketValue - transactionCost;
                  const unrealizedGainPct =
                    transactionCost !== 0
                      ? (marketValue / transactionCost - 1) * 100
                      : 0;

                  const realizedGainPct =
                    record.totalSoldCost !== 0
                      ? (record.realizedGain / record.totalSoldCost) * 100
                      : 0;

                  return (
                    <tr
                      key={record.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      {isSelling && (
                        <td className="px-4 py-2 w-12 text-center">
                          {record.shareNumber > 0 && (
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              checked={checkedItems[record.id] ?? false}
                              onChange={() =>
                                handleCheckboxChange(
                                  record.id,
                                  record.shareNumber,
                                )
                              }
                            />
                          )}
                        </td>
                      )}
                      {isSelling && (
                        <td className="px-4 py-2 w-32">
                          {checkedItems[record.id] && (
                            <Input
                              type="number"
                              placeholder="股數"
                              className="h-8 text-center"
                              defaultValue={
                                stockRecordSummarySell.stockRecordSellShare[
                                  record.id
                                ]?.shareNumber
                              }
                              onBlur={(e) =>
                                handleShareNumberBlur(
                                  e,
                                  record.id,
                                  record.shareNumber,
                                )
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && e.currentTarget.blur()
                              }
                            />
                          )}
                        </td>
                      )}
                      <td className="px-4 py-2">
                        {Number(record.buyPrice).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 font-medium text-blue-600">
                        {Number(record.shareNumber).toFixed(5)}
                      </td>
                      <td className="px-4 py-2">
                        {Number(transactionCost).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {Number(marketValue).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            record.realizedGain >= 0
                              ? "text-red-500"
                              : "text-green-500"
                          }
                        >
                          {Number(record.realizedGain).toFixed()} (
                          {realizedGainPct.toFixed(1)}%)
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            unrealizedGain > 0
                              ? "text-red-500"
                              : "text-green-500"
                          }
                        >
                          {Number(unrealizedGain).toFixed(2)} (
                          {unrealizedGainPct.toFixed(1)}%)
                        </span>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
          {isSelling && (
            <div className="flex justify-end items-center space-x-4 mt-4 bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-700 font-bold">總欲賣出股數:</span>
              <span className="text-xl font-bold text-blue-600 px-2">
                {totalSellShares}
              </span>
              <Button
                variant="outline"
                onClick={() => handleCancelOnClick(row)}
              >
                取消
              </Button>
              <Button
                onClick={() => setBundleSellShowState(true)}
                disabled={totalSellShares <= 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                確認賣出
              </Button>
            </div>
          )}
        </div>
      );
    },
    [
      sellIdx,
      totalSellShares,
      checkedItems,
      stockRecordSummarySell,
      handleCheckboxChange,
      handleShareNumberBlur,
      handleCancelOnClick,
    ],
  );

  if (stockSummariesIsLoading) return <LoadingPage />;

  const normalData = stockSummaries.filter(
    (s: StockSummary) =>
      s.brokerageFirm.settlementCurrency.id ===
      s.brokerageFirm.transactionCurrency.id,
  );
  const exchangeData = stockSummaries.filter(
    (s: StockSummary) =>
      s.brokerageFirm.settlementCurrency.id !==
      s.brokerageFirm.transactionCurrency.id,
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <div className="pt-[--navbar-height]">
        <PageLabel title="股票總覽" />
        <div className="max-w-[95vw] mx-auto px-4 py-6 flex flex-col items-center gap-6">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col justify-between gap-6 h-full">
              <SummaryCard
                title="總投資"
                className="bg-blue-50 border-blue-200 text-blue-800"
                value={investmentSummary.totalInvestment.toFixed(2)}
              />
              <SummaryCard
                title="當前市值"
                className="bg-yellow-50 border-yellow-200 text-yellow-800"
                value={investmentSummary.currentMarketValue.toFixed(2)}
              />
              <SummaryCard
                title="未實現損益"
                value={investmentSummary.totalUnrealizedGain.toFixed(2)}
                percentage={investmentSummary.unrealizedGainPercentage}
                className={
                  investmentSummary.totalUnrealizedGain >= 0
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-green-50 border-green-200 text-green-700"
                }
              />
            </div>
            <PieChartCard
              title="資產佔比"
              data={investmentSummary.portfolioAllocation}
              height="min(250px)"
            />
          </div>

          <div className="w-full space-y-8 mt-4">
            {normalData.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 pl-2 border-l-4 border-blue-500">
                  國內券商庫存
                </h2>
                <DataTable
                  columns={normalColumns}
                  data={normalData}
                  renderSubComponent={SubComponent}
                />
              </div>
            )}

            {exchangeData.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3 pl-2 border-l-4 border-purple-500">
                  海外券商庫存 (含匯率計算)
                </h2>
                <DataTable
                  columns={exchangeColumns}
                  data={exchangeData}
                  renderSubComponent={SubComponent}
                />
              </div>
            )}
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
