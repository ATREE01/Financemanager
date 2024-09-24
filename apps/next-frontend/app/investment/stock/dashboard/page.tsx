"use client";

import {
  CreateStockSellRecord,
  StockRecordSummarySell,
} from "@financemanager/financemanager-webiste-types";
import { useEffect, useState } from "react";
import * as React from "react";

import DetailTable from "@/app/components/detail-table";
import StockFormManager from "@/app/components/forms/stock-form-manager";
import PageLabel from "@/app/components/page-label";
import { useStockSummaries } from "@/lib/features/stock/StockSlice";

export default function Deashboard() {
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
    "未實現損益(易)",
    "未實現損益(割)",
    "功能",
  ];

  const stockSummaries = useStockSummaries();
  const normalStockSummaries = stockSummaries.filter(
    (stockSummary) =>
      stockSummary.brokerageFirm.transactionCurrency.id ===
      stockSummary.brokerageFirm.settlementCurrency.id,
  );
  const exchangeStockSummaries = stockSummaries.filter(
    (stockSummary) =>
      stockSummary.brokerageFirm.transactionCurrency.id !==
      stockSummary.brokerageFirm.settlementCurrency.id,
  );

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

  useEffect(() => {
    setTotalSellShare(
      Object.values(stockRecordSummarySell.stockRecordSellShare).reduce(
        (acc: number, curr: CreateStockSellRecord) => acc + curr.shareNumber,
        0,
      ),
    );
  }, [stockRecordSummarySell]);

  return (
    <main className="pt-[--navbar-height] bg-slate-100">
      <PageLabel title="股票總覽" />
      <div className="flex justify-center p-2">
        <div className="h-[80vh]">
          <div className="max-w-[90vw] max-h-1/2 overflow-auto mb-4">
            <DetailTable
              titles={normalTableTitles}
              tableContent={normalStockSummaries.map((stockSummary, index) => {
                const marketValue =
                  stockSummary.totalShare * stockSummary.userStock.stock.close;
                return (
                  <React.Fragment key={index}>
                    <tr className="border-b hover:bg-gray-100">
                      <td className="table-data-cell">
                        {stockSummary.brokerageFirm.name}
                      </td>
                      <td className="table-data-cell">
                        {stockSummary.brokerageFirm.transactionCurrency.name}
                      </td>
                      <td className="table-data-cell">
                        {stockSummary.userStock.name}
                      </td>
                      <td className="table-data-cell">
                        {stockSummary.averageBuyPrice.toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(Number(stockSummary.totalShare).toFixed(5))}
                      </td>
                      <td className="table-data-cell">
                        {Number(stockSummary.totalTransactionCost).toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(stockSummary.userStock.stock.close).toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(marketValue).toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(stockSummary.realizedGain)}(
                        {stockSummary.totalSoldCost !== 0
                          ? Number(
                              stockSummary.realizedGain /
                                stockSummary.totalSoldCost,
                            ).toFixed(2)
                          : 0}
                        %)
                      </td>
                      <td className="table-data-cell">
                        {Number(
                          marketValue - stockSummary.totalTransactionCost,
                        ).toFixed()}
                        (
                        {stockSummary.averageBuyPrice !== 0
                          ? Number(
                              stockSummary.userStock.stock.close /
                                stockSummary.averageBuyPrice -
                                1,
                            ).toFixed(2)
                          : 0}
                        %)
                      </td>
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
                    {expandedIdx === index && (
                      <tr>
                        <td colSpan={11}>
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
                                    const cost =
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
                                                stockRecordSummary.shareNumber >
                                                  0 && (
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      checkedItems[
                                                        stockRecordSummary.id
                                                      ] ?? false
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
                                              {checkedItems[
                                                stockRecordSummary.id
                                              ] && (
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
                                                    handleShareNumberKeyDown(
                                                      event,
                                                    )
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
                                          {Number(
                                            stockRecordSummary.shareNumber,
                                          )}
                                        </td>
                                        <td className="table-data-cell">
                                          {Number(cost)}
                                        </td>
                                        <td className="table-data-cell">
                                          {Number(marketValue).toFixed(0)}
                                        </td>
                                        <td className="table-data-cell">
                                          {Number(
                                            stockRecordSummary.realizedGain,
                                          )}
                                          (
                                          {stockRecordSummary.totalSoldCost !==
                                          0
                                            ? Number(
                                                stockRecordSummary.realizedGain /
                                                  stockRecordSummary.totalSoldCost,
                                              )
                                            : 0}
                                          %)
                                        </td>
                                        <td className="table-data-cell">
                                          {Number(
                                            marketValue -
                                              stockRecordSummary.amount,
                                          ).toFixed()}
                                          (
                                          {cost !== 0
                                            ? Number(
                                                marketValue / cost - 1,
                                              ).toFixed(2)
                                            : 0}
                                          %)
                                        </td>
                                      </tr>
                                    );
                                  },
                                )}
                                {sellIdx === index && (
                                  <tr key="confirm-sell">
                                    <td
                                      colSpan={8}
                                      className="table-data-cell text-right"
                                    >
                                      <div className="flex justify-end items-center space-x-4">
                                        {/* Displaying total shares to sell */}
                                        <span className="font-bold">
                                          總股數:
                                        </span>
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
                                            setBundleSellShowState(
                                              !bundleSellShowState,
                                            )
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
              })}
            />
          </div>

          <div className="max-w-[90vw] max-h-1/2 overflow-auto">
            <DetailTable
              titles={exchnageTableTitles}
              tableContent={exchangeStockSummaries.map((stockSummary, idx) => {
                const index = idx + normalStockSummaries.length;
                const traMrketValue =
                  stockSummary.totalShare * stockSummary.userStock.stock.close; // market value in transaction currency
                const setMarketValue =
                  traMrketValue *
                  stockSummary.brokerageFirm.transactionCurrency.exchangeRate; // market value in settlement currency

                return (
                  <React.Fragment key={index}>
                    <tr className="border-b hover:bg-gray-100">
                      <td className="table-data-cell">
                        {stockSummary.brokerageFirm.name}
                      </td>
                      <td className="table-data-cell">
                        {stockSummary.brokerageFirm.transactionCurrency.name}
                      </td>
                      <td className="table-data-cell">
                        {stockSummary.brokerageFirm.settlementCurrency.name}
                      </td>
                      <td className="table-data-cell">
                        {stockSummary.userStock.name}
                      </td>
                      <td className="table-data-cell">
                        {stockSummary.averageBuyPrice.toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(Number(stockSummary.totalShare).toFixed(5))}
                      </td>
                      <td className="table-data-cell">
                        {Number(stockSummary.totalTransactionCost).toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(stockSummary.totalSettlementCost).toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(stockSummary.userStock.stock.close).toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(traMrketValue).toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(stockSummary.realizedGain).toFixed(2)}
                      </td>
                      <td className="table-data-cell">
                        {Number(
                          traMrketValue - stockSummary.totalTransactionCost,
                        ).toFixed(2)}
                        (
                        {stockSummary.totalTransactionCost !== 0
                          ? Number(
                              (traMrketValue -
                                stockSummary.totalTransactionCost) /
                                stockSummary.totalTransactionCost,
                            ).toFixed(2)
                          : 0}
                        %)
                      </td>
                      <td className="table-data-cell">
                        {Number(
                          setMarketValue - stockSummary.totalAmount,
                        ).toFixed(2)}
                        (
                        {stockSummary.totalSettlementCost !== 0
                          ? Number(
                              (setMarketValue -
                                stockSummary.totalSettlementCost) /
                                stockSummary.totalSettlementCost,
                            ).toFixed(2)
                          : 0}
                        %)
                      </td>
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
                    {expandedIdx === index && (
                      <tr>
                        <td colSpan={14}>
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
                                  (stockRecordSummary) => (
                                    <tr
                                      key={stockRecordSummary.id}
                                      className="border-b hover:bg-gray-100"
                                    >
                                      {sellIdx === index && (
                                        <>
                                          <td className="table-data-cell w-4">
                                            {sellIdx === index &&
                                              stockRecordSummary.shareNumber >
                                                0 && (
                                                <input
                                                  type="checkbox"
                                                  checked={
                                                    checkedItems[
                                                      stockRecordSummary.id
                                                    ] ?? false
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
                                            {checkedItems[
                                              stockRecordSummary.id
                                            ] && (
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
                                                  handleShareNumberKeyDown(
                                                    event,
                                                  )
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
                                        {Number(
                                          stockRecordSummary.buyPrice *
                                            stockRecordSummary.shareNumber,
                                        )}
                                      </td>
                                      <td className="table-data-cell">
                                        {Number(
                                          stockRecordSummary.shareNumber *
                                            stockSummary.userStock.stock.close,
                                        )}
                                      </td>
                                      <td className="table-data-cell">
                                        {Number(
                                          stockRecordSummary.realizedGain,
                                        ).toFixed(2)}
                                        (
                                        {stockRecordSummary.totalSoldCost !== 0
                                          ? Number(
                                              stockRecordSummary.realizedGain /
                                                stockRecordSummary.totalSoldCost,
                                            ).toFixed(2)
                                          : 0}
                                        %)
                                      </td>
                                      <td className="table-data-cell">
                                        {Number(
                                          stockRecordSummary.shareNumber *
                                            stockSummary.userStock.stock.close,
                                        ).toFixed(2)}
                                        (
                                        {stockRecordSummary.shareNumber !== 0
                                          ? Number(
                                              stockRecordSummary.userStock.stock
                                                .close /
                                                stockRecordSummary.buyPrice -
                                                1,
                                            ).toFixed(2)
                                          : 0}
                                        %)
                                      </td>
                                    </tr>
                                  ),
                                )}
                                {sellIdx === index && (
                                  <tr key="confirm-sell">
                                    <td
                                      colSpan={8}
                                      className="table-data-cell text-right"
                                    >
                                      <div className="flex justify-end items-center space-x-4">
                                        {/* Displaying total shares to sell */}
                                        <span className="font-bold">
                                          總股數:
                                        </span>
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
                                            setBundleSellShowState(
                                              !bundleSellShowState,
                                            )
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
              })}
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
    </main>
  );
}
