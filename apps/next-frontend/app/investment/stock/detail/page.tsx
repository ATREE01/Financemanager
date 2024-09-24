"use client";

import {
  StockRecordType,
  UpdateStockBundleSellRecord,
  UpdateStockRecord,
  UpdateStockSellRecord,
} from "@financemanager/financemanager-webiste-types";
import { useState } from "react";
import * as React from "react";

import DetailTable from "@/app/components/detail-table";
import StockFormManager from "@/app/components/forms/stock-form-manager";
import PageLabel from "@/app/components/page-label";
import { usePhraseMap } from "@/lib/features/PhraseMap/PhraseMapSlice";
import {
  useDeleteStockBundleSellRecordMutation,
  useDeleteStockBuyRecorMutation,
  useDeleteStockSellRecordMutation,
} from "@/lib/features/stock/StockApiSlice";
import {
  useStockBundleSellRecords,
  useStockRecords,
} from "@/lib/features/stock/StockSlice";

export default function Detail() {
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
  const [expandedIdx, setExpandedIdx] = useState(-1);

  const [deleteStockBuyRecord] = useDeleteStockBuyRecorMutation();
  const [deleteStockBundleSellRecord] =
    useDeleteStockBundleSellRecordMutation();

  const [deleteStockSellRecord] = useDeleteStockSellRecordMutation();

  const phraseMap = usePhraseMap();
  const stockRecords = useStockRecords();
  const stockBundleSelRecords = useStockBundleSellRecords();

  const buyTableTitles = [
    "日期",
    "券商",
    "買入方法",
    "金融機構",
    "交易幣別",
    "交割幣別",
    "股票名稱",
    "交易股價",
    "匯率",
    "股數",
    "手續費",
    "備註",
    "操作",
  ];
  const sellTableTitles = [
    "日期",
    "券商",
    "股票名稱",
    "金融機構",
    "賣出價格",
    "股數",
    "匯率",
    "手續費",
    "交易稅",
    "交易金額",
    "備註",
    "操作",
  ];
  const subTableTitles = ["序號", "股數", "操作"];

  async function deleteStockRecord(id: number) {
    const yes = window.confirm("確定要刪除嗎?");
    if (yes)
      try {
        await deleteStockBuyRecord(id).unwrap();
        window.alert("刪除成功");
      } catch (e) {
        window.alert("伺服器錯誤，請稍後再試");
      }
  }

  async function handledeleteStockBundleSellRecord(id: number) {
    const yes = window.confirm("確定要刪除嗎?");
    if (yes)
      try {
        await deleteStockBundleSellRecord(id).unwrap();
        window.alert("刪除成功");
      } catch (e) {
        window.alert("伺服器錯誤，請稍後再試");
      }
  }

  async function handleDeleteStockSellRecord(id: number) {
    const yes = window.confirm("確定要刪除嗎?");
    if (yes)
      try {
        await deleteStockSellRecord(id).unwrap();
        window.alert("刪除成功");
      } catch (e) {
        window.alert("伺服器錯誤，請稍後再試");
      }
  }

  return (
    <main className="pt-[--navbar-height] bg-slate-100">
      <PageLabel title="股票紀錄" />
      <div className="h-[80vh] flex flex-col items-center">
        <div className="max-h-1/2 w-4/5 m-2">
          <div className="text-black text-center text-lg font-bold">
            買入紀錄
          </div>
          <div className="max-h-[60vh] overflow-auto">
            <DetailTable
              titles={buyTableTitles}
              tableContent={stockRecords.map((record) =>
                record.stockBuyRecords.map((buyRecord) => (
                  <tr key={buyRecord.id} className="border-b hover:bg-gray-100">
                    <td className="table-data-cell">{buyRecord.date}</td>
                    <td className="table-data-cell">
                      {record.brokerageFirm.name}
                    </td>
                    <td className="table-data-cell">
                      {phraseMap.stockBuyMethod[buyRecord.buyMethod]}
                    </td>
                    <td className="table-data-cell">{buyRecord.bank.name}</td>
                    <td className="table-data-cell">
                      {record.brokerageFirm.transactionCurrency.name}
                    </td>
                    <td className="table-data-cell">
                      {record.brokerageFirm.settlementCurrency.name}
                    </td>
                    <td className="table-data-cell">
                      {record.userStock.name} ({record.userStock.stock.code})
                    </td>
                    <td className="table-data-cell">
                      {Number(record.buyPrice)}
                    </td>
                    <td className="table-data-cell">
                      {Number(record.buyExchangeRate)}
                    </td>
                    <td className="table-data-cell">
                      {Number(buyRecord.shareNumber)}
                    </td>
                    <td className="table-data-cell">
                      {Number(buyRecord.charge)}
                    </td>
                    <td className="table-data-cell">{buyRecord.note}</td>
                    <td className="table-data-cell">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200 mx-1"
                        onClick={() => {
                          const data = {
                            id: record.id,
                            type: StockRecordType.BUY,
                            brokerageFirmId: record.brokerageFirm.id,
                            userStockId: record.userStock.id,
                            buyPrice: record.buyPrice,
                            buyExchangeRate: record.buyExchangeRate,
                            updateStockBuyRecord: {
                              id: buyRecord.id,
                              date: buyRecord.date,
                              buyMethod: buyRecord.buyMethod,
                              bankId: buyRecord.bank.id,
                              shareNumber: buyRecord.shareNumber,
                              charge: buyRecord.charge,
                              amount: buyRecord.amount,
                              note: buyRecord.note,
                            },
                          } as UpdateStockRecord;
                          setStockRecordFormData(data);
                          setShowUpdateStockRecordForm(
                            !showUpdateStockRecordForm,
                          );
                        }}
                      >
                        修改
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors duration-200 mx-1"
                        onClick={() => deleteStockRecord(buyRecord.id)}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                )),
              )}
            />
          </div>
        </div>
        <div className="max-h-1/2 w-4/5 m-2">
          <div className="text-black text-center text-lg font-bold">
            賣出紀錄
          </div>
          <div className="max-h-[60vh] overflow-auto">
            <DetailTable
              titles={sellTableTitles}
              titleColor="bg-red-400"
              tableContent={stockBundleSelRecords.map((record, index) => {
                return (
                  <React.Fragment key={record.id}>
                    <tr className="border-b hover:bg-gray-100">
                      <td className="table-data-cell">{record.date}</td>
                      <td className="table-data-cell">
                        {record.brokerageFirm.name}
                      </td>
                      <td className="table-data-cell">
                        {record.userStock.name}
                      </td>
                      <td className="table-data-cell">{record.bank.name}</td>
                      <td className="table-data-cell">
                        {Number(record.sellPrice)}
                      </td>
                      <td className="table-data-cell">
                        {Number(
                          record.stockSellRecords.reduce(
                            (acc, cur) => (acc += cur.shareNumber),
                            0,
                          ),
                        )}
                      </td>
                      <td className="table-data-cell">
                        {Number(record.sellExchangeRate)}
                      </td>
                      <td className="table-data-cell">
                        {Number(record.charge)}
                      </td>
                      <td className="table-data-cell">{Number(record.tax)}</td>
                      <td className="table-data-cell">
                        {Number(record.amount)}
                      </td>
                      <td className="table-data-cell">{record.note}</td>
                      <td className="table-data-cell">
                        <button
                          className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors duration-200 mx-1"
                          onClick={() =>
                            setExpandedIdx(expandedIdx === index ? -1 : index)
                          }
                        >
                          詳細
                        </button>
                        <button
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200 mx-1"
                          onClick={() => {
                            const data = {
                              id: record.id,
                              date: record.date,
                              bankId: record.bank.id,
                              brokerageFirm: record.brokerageFirm,
                              userStockId: record.userStock.id,
                              sellPrice: record.sellPrice,
                              sellExchangeRate: record.sellExchangeRate,
                              charge: record.charge,
                              tax: record.tax,
                              amount: record.amount,
                              note: record.note,
                            } as UpdateStockBundleSellRecord;
                            setStockBundleSellFormData(data);
                            setShowUpdateBundleSellForm(
                              !showUpdateBundleSellForm,
                            );
                          }}
                        >
                          修改
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors duration-200 mx-1"
                          onClick={() =>
                            handledeleteStockBundleSellRecord(record.id)
                          }
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                    {expandedIdx === index && (
                      <tr>
                        <td colSpan={2}>
                          <DetailTable
                            titles={subTableTitles}
                            titleColor="bg-green-400"
                            tableContent={
                              <>
                                {record.stockSellRecords.map((sellRecord) => (
                                  <tr
                                    key={sellRecord.id}
                                    className="border-b hover:bg-gray-100"
                                  >
                                    <td className="table-data-cell">
                                      {index + 1}
                                    </td>
                                    <td className="table-data-cell">
                                      {Number(
                                        Number(sellRecord.shareNumber).toFixed(
                                          5,
                                        ),
                                      )}
                                    </td>
                                    <td className="table-data-cell">
                                      <button
                                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors duration-200 mx-1"
                                        onClick={() => {
                                          const data = {
                                            id: sellRecord.id,
                                            shareNumber: sellRecord.shareNumber,
                                          } as UpdateStockSellRecord;
                                          setStockSellRecord(data);
                                          setShowUpdateStockSellForm(
                                            !showUpdateStockSellForm,
                                          );
                                        }}
                                      >
                                        修改
                                      </button>
                                      <button
                                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors duration-200 mx-1"
                                        onClick={() =>
                                          handleDeleteStockSellRecord(
                                            sellRecord.id,
                                          )
                                        }
                                      >
                                        刪除
                                      </button>
                                    </td>
                                  </tr>
                                ))}
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