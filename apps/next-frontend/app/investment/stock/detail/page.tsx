"use client";

import {
  StockBundleSellRecord,
  StockBuyRecord,
  StockRecordType,
  UpdateStockBundleSellRecord,
  UpdateStockRecord,
  UpdateStockSellRecord,
} from "@financemanager/financemanager-website-types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import * as React from "react";

import ConditionFilter from "@/app/components/condition-filter";
import { DataTable } from "@/app/components/data-table";
import StockFormManager from "@/app/components/forms/stock-form-manager";
import LoadingPage from "@/app/components/loading-page";
import PageLabel from "@/app/components/page-label";
import { Button } from "@/components/ui/button";
import { useUserId } from "@/lib/features/Auth/AuthSlice";
import { usePhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";
import {
  useDeleteStockBundleSellRecordMutation,
  useDeleteStockBuyRecordMutation,
  useDeleteStockSellRecordMutation,
  useGetStockBundleSellRecordsQuery,
  useGetStockRecordsQuery,
  useGetUserStocksQuery,
} from "@/lib/features/stock/StockApiSlice";

export interface MappedStockBuyRecord extends StockBuyRecord {
  brokerageFirm: string;
  transactionCurrency: string;
  settlementCurrency: string;
  userStockName: string;
  stockCode: string;
  buyPrice: number;
  buyExchangeRate: number;
  recordId: number;
  brokerageFirmId: number | string;
  userStockId: number | string;
}

export default function Detail() {
  const userId = useUserId();
  const router = useRouter();
  React.useEffect(() => {
    if (!userId) router.push("/auth/login");
  }, [router, userId]);

  const [stock, setStock] = useState<string | number>("default");

  const [stockRecordFormData, setStockRecordFormData] =
    useState<UpdateStockRecord>();
  const [stockBundleSellFormData, setStockBundleSellFormData] =
    useState<UpdateStockBundleSellRecord>();
  const [stockSellRecord, setStockSellRecord] =
    useState<UpdateStockSellRecord>();

  const [showUpdateStockRecordForm, setShowUpdateStockRecordForm] =
    useState(false);
  const [showUpdateBundleSellForm, setShowUpdateBundleSellForm] =
    useState(false);
  const [showUpdateStockSellForm, setShowUpdateStockSellForm] = useState(false);

  const [deleteStockBuyRecord] = useDeleteStockBuyRecordMutation();
  const [deleteStockBundleSellRecord] =
    useDeleteStockBundleSellRecordMutation();
  const [deleteStockSellRecord] = useDeleteStockSellRecordMutation();

  const phraseMap = usePhraseMap();
  const { data: stockRecords, isLoading: stockRecordsIsLoading } =
    useGetStockRecordsQuery();
  const {
    data: stockBundleSelRecords,
    isLoading: stockBundleSellRecordsIsLoading,
  } = useGetStockBundleSellRecordsQuery();
  const { data: userStocks } = useGetUserStocksQuery();

  const deleteStockRecord = useCallback(
    async (id: number) => {
      const yes = window.confirm("確定要刪除嗎?");
      if (yes)
        try {
          await deleteStockBuyRecord(id).unwrap();
          window.alert("刪除成功");
        } catch {
          window.alert("伺服器錯誤，請稍後再試");
        }
    },
    [deleteStockBuyRecord],
  );

  const handledeleteStockBundleSellRecord = useCallback(
    async (id: number) => {
      const yes = window.confirm("確定要刪除嗎?");
      if (yes)
        try {
          await deleteStockBundleSellRecord(id).unwrap();
          window.alert("刪除成功");
        } catch {
          window.alert("伺服器錯誤，請稍後再試");
        }
    },
    [deleteStockBundleSellRecord],
  );

  const handleDeleteStockSellRecord = useCallback(
    async (id: number) => {
      const yes = window.confirm("確定要刪除嗎?");
      if (yes)
        try {
          await deleteStockSellRecord(id).unwrap();
          window.alert("刪除成功");
        } catch {
          window.alert("伺服器錯誤，請稍後再試");
        }
    },
    [deleteStockSellRecord],
  );

  const stockOptions = useMemo(() => {
    return [
      { value: "default", name: "-- 特定股票 --" },
      ...(userStocks || []).map((userStock) => ({
        value: userStock.id,
        name: `${userStock.name} (${userStock.stock.code})`,
      })),
    ];
  }, [userStocks]);

  const stockBuyRecordsArray = useMemo<MappedStockBuyRecord[]>(() => {
    if (!stockRecords) return [];
    return stockRecords
      .flatMap((record) =>
        record.stockBuyRecords.map((buyRecord) => ({
          ...buyRecord,
          brokerageFirm: record.brokerageFirm.name,
          transactionCurrency: record.brokerageFirm.transactionCurrency.name,
          settlementCurrency: record.brokerageFirm.settlementCurrency.name,
          userStockName: record.userStock.name,
          stockCode: record.userStock.stock.code,
          buyPrice: record.buyPrice,
          buyExchangeRate: record.buyExchangeRate,
          recordId: record.id,
          brokerageFirmId: record.brokerageFirm.id,
          userStockId: record.userStock.id,
        })),
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stockRecords]);

  const filteredBuyRecords = useMemo(() => {
    return stockBuyRecordsArray.filter((record) => {
      return stock === "default" || record.userStockId === stock;
    });
  }, [stockBuyRecordsArray, stock]);

  const filteredSellRecords = useMemo(() => {
    return (stockBundleSelRecords || []).filter((record) => {
      return stock === "default" || record.userStock.id === stock;
    });
  }, [stockBundleSelRecords, stock]);

  const buyColumns = useMemo<ColumnDef<MappedStockBuyRecord>[]>(
    () => [
      { accessorKey: "date", header: "日期" },
      { accessorKey: "brokerageFirm", header: "券商" },
      {
        accessorKey: "buyMethod",
        header: "買入方法",
        cell: ({ row }) =>
          phraseMap.stockBuyMethod?.[row.original.buyMethod] ||
          row.original.buyMethod,
      },
      { accessorKey: "bank.name", header: "金融機構" },
      { accessorKey: "transactionCurrency", header: "交易幣別" },
      { accessorKey: "settlementCurrency", header: "交割幣別" },
      {
        accessorKey: "userStockName",
        header: "股票名稱",
        cell: ({ row }) => (
          <span className="font-bold">
            {row.original.userStockName} ({row.original.stockCode})
          </span>
        ),
      },
      {
        accessorKey: "buyPrice",
        header: "交易股價",
        cell: ({ row }) => Number(row.original.buyPrice),
      },
      {
        accessorKey: "buyExchangeRate",
        header: "匯率",
        cell: ({ row }) => Number(row.original.buyExchangeRate),
      },
      {
        accessorKey: "shareNumber",
        header: "股數",
        cell: ({ row }) => (
          <span className="font-medium text-blue-600">
            {Number(row.original.shareNumber)}
          </span>
        ),
      },
      {
        accessorKey: "charge",
        header: "手續費",
        cell: ({ row }) => Number(row.original.charge),
      },
      {
        accessorKey: "amount",
        header: "交易金額",
        cell: ({ row }) => (
          <span className="font-medium">{Number(row.original.amount)}</span>
        ),
      },
      {
        accessorKey: "note",
        header: "備註",
        cell: ({ row }) => row.original.note || "-",
      },
      {
        id: "actions",
        header: "操作",
        cell: ({ row }) => (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
              onClick={() => {
                const data = {
                  id: row.original.recordId,
                  type: StockRecordType.BUY,
                  brokerageFirmId: row.original.brokerageFirmId,
                  userStockId: row.original.userStockId,
                  buyPrice: row.original.buyPrice,
                  buyExchangeRate: row.original.buyExchangeRate,
                  updateStockBuyRecord: {
                    id: row.original.id,
                    date: row.original.date,
                    buyMethod: row.original.buyMethod,
                    bankId: row.original.bank.id,
                    shareNumber: row.original.shareNumber,
                    charge: row.original.charge,
                    amount: row.original.amount,
                    note: row.original.note,
                  },
                } as UpdateStockRecord;
                setStockRecordFormData(data);
                setShowUpdateStockRecordForm(true);
              }}
            >
              修改
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
              onClick={() => deleteStockRecord(row.original.id)}
            >
              刪除
            </Button>
          </div>
        ),
      },
    ],
    [phraseMap.stockBuyMethod, deleteStockRecord],
  );

  const sellColumns = useMemo<ColumnDef<StockBundleSellRecord>[]>(
    () => [
      { accessorKey: "date", header: "日期" },
      { accessorKey: "brokerageFirm.name", header: "券商" },
      {
        accessorKey: "userStock.name",
        header: "股票名稱",
        cell: ({ row }) => (
          <span className="font-bold">{row.original.userStock.name}</span>
        ),
      },
      { accessorKey: "bank.name", header: "金融機構" },
      {
        accessorKey: "sellPrice",
        header: "賣出價格",
        cell: ({ row }) => Number(row.original.sellPrice),
      },
      {
        accessorKey: "shareNumber",
        header: "股數",
        cell: ({ row }) => (
          <span className="font-medium text-blue-600">
            {Number(
              row.original.stockSellRecords.reduce(
                (acc, cur) => (acc += cur.shareNumber),
                0,
              ),
            )}
          </span>
        ),
      },
      {
        accessorKey: "sellExchangeRate",
        header: "匯率",
        cell: ({ row }) => Number(row.original.sellExchangeRate),
      },
      {
        accessorKey: "charge",
        header: "手續費",
        cell: ({ row }) => Number(row.original.charge),
      },
      {
        accessorKey: "tax",
        header: "交易稅",
        cell: ({ row }) => Number(row.original.tax),
      },
      {
        accessorKey: "amount",
        header: "交易金額",
        cell: ({ row }) => (
          <span className="font-medium">{Number(row.original.amount)}</span>
        ),
      },
      {
        accessorKey: "note",
        header: "備註",
        cell: ({ row }) => row.original.note || "-",
      },
      {
        id: "actions",
        header: "操作",
        cell: ({ row }) => (
          <div className="flex justify-center space-x-2">
            <Button
              variant={row.getIsExpanded() ? "default" : "outline"}
              size="sm"
              className={
                row.getIsExpanded()
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
              }
              onClick={() => row.toggleExpanded()}
            >
              詳細
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
              onClick={() => {
                const data = {
                  id: row.original.id,
                  date: row.original.date,
                  bankId: row.original.bank.id,
                  brokerageFirm: row.original.brokerageFirm,
                  userStockId: row.original.userStock.id,
                  sellPrice: row.original.sellPrice,
                  sellExchangeRate: row.original.sellExchangeRate,
                  charge: row.original.charge,
                  tax: row.original.tax,
                  amount: row.original.amount,
                  note: row.original.note,
                } as UpdateStockBundleSellRecord;
                setStockBundleSellFormData(data);
                setShowUpdateBundleSellForm(true);
              }}
            >
              修改
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
              onClick={() => handledeleteStockBundleSellRecord(row.original.id)}
            >
              刪除
            </Button>
          </div>
        ),
      },
    ],
    [handledeleteStockBundleSellRecord],
  );

  const RenderSellSubComponent = useCallback(
    ({ row }: { row: Row<StockBundleSellRecord> }) => {
      const sellRecords = row.original.stockSellRecords;

      return (
        <div className="bg-green-50 rounded-lg shadow-inner border border-green-200 p-4 my-2">
          <h4 className="text-md font-bold text-green-800 mb-3 border-b border-green-300 pb-2">
            賣出批次詳細
          </h4>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs text-white uppercase bg-green-500 rounded-t-lg">
              <tr>
                <th className="px-4 py-2 rounded-tl-lg">序號</th>
                <th className="px-4 py-2">賣出股數</th>
                <th className="px-4 py-2 text-center rounded-tr-lg">操作</th>
              </tr>
            </thead>
            <tbody>
              {sellRecords.map((sellRecord, index) => (
                <tr
                  key={sellRecord.id}
                  className="bg-white border-b hover:bg-green-100/50"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {Number(Number(sellRecord.shareNumber).toFixed(5))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                        onClick={() => {
                          const data = {
                            id: sellRecord.id,
                            shareNumber: sellRecord.shareNumber,
                          } as UpdateStockSellRecord;
                          setStockSellRecord(data);
                          setShowUpdateStockSellForm(true);
                        }}
                      >
                        修改
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                        onClick={() =>
                          handleDeleteStockSellRecord(sellRecord.id)
                        }
                      >
                        刪除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    [handleDeleteStockSellRecord],
  );

  if (
    !stockRecords ||
    stockRecordsIsLoading ||
    !stockBundleSelRecords ||
    stockBundleSellRecordsIsLoading ||
    !phraseMap.stockBuyMethod
  )
    return <LoadingPage />;

  return (
    <main className="pt-[--navbar-height] bg-gray-50 min-h-screen">
      <PageLabel title="股票明細" />
      <div className="flex flex-col items-center py-6 gap-4">
        <div className="w-[90vw] md:w-[60vw] flex flex-wrap items-center justify-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <ConditionFilter
              options={stockOptions}
              setFilter={setStock}
              value={stock as string}
            />
          </div>
        </div>

        <div className="w-[90vw] max-w-[1400px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pl-2 border-l-4 border-blue-500">
            買入紀錄
          </h2>
          <DataTable columns={buyColumns} data={filteredBuyRecords} />
        </div>

        <div className="w-[90vw] max-w-[1400px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 pl-2 border-l-4 border-red-500">
            賣出紀錄
          </h2>
          <DataTable
            columns={sellColumns}
            data={filteredSellRecords}
            renderSubComponent={RenderSellSubComponent}
          />
        </div>

        <StockFormManager
          updateStockRecordShowState={{
            isShow: showUpdateStockRecordForm,
            setShow: setShowUpdateStockRecordForm,
          }}
          updateStockRecordFormData={stockRecordFormData}
          bundleSellShowState={null}
          updateBundleSellShowState={{
            isShow: showUpdateBundleSellForm,
            setShow: setShowUpdateBundleSellForm,
          }}
          udpateBundleSellFormData={stockBundleSellFormData}
          updateStockSellShowState={{
            isShow: showUpdateStockSellForm,
            setShow: setShowUpdateStockSellForm,
          }}
          updateStockSellFormData={stockSellRecord}
        />
      </div>
    </main>
  );
}
