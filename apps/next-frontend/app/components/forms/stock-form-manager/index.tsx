import {
  ShowState,
  StockRecordSummarySell,
  UpdateStockBundleSellRecord,
  UpdateStockRecord,
  UpdateStockSellRecord,
} from "@financemanager/financemanager-website-types";
import { useState } from "react";

import BrokerageFirmForm from "./brokerage-firm";
import BundleSellRecord from "./bundle-sell-record";
import StockRecordForm from "./record";
import StockSellRecord from "./stock-sell-record";
import StockSplitForm from "./stock-splite";
import UserStockForm from "./user-stock";

export default function StockFormManager({
  updateStockRecordShowState,
  updateStockRecordFormData,

  bundleSellShowState,
  stockRecordSummarySell,

  updateBundleSellShowState,
  udpateBundleSellFormData,

  updateStockSellShowState,
  updateStockSellFormData,
}: {
  updateStockRecordShowState: ShowState | null;
  updateStockRecordFormData?: UpdateStockRecord | null;

  bundleSellShowState: ShowState | null;
  stockRecordSummarySell?: StockRecordSummarySell;

  updateBundleSellShowState: ShowState | null;
  udpateBundleSellFormData?: UpdateStockBundleSellRecord | null;

  updateStockSellShowState: ShowState | null;
  updateStockSellFormData?: UpdateStockSellRecord | null;
}) {
  const [show, setShow] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showBrokerageFirmForm, setShowBrokerageFirmForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  const [showStockSplitForm, setShowStockSplitForm] = useState(false);

  const handleShowClick = () => setShow(!show);
  const handleNewRecordClick = () => setShowRecordForm(!showRecordForm);
  const handleNewBrokerageFirmClick = () =>
    setShowBrokerageFirmForm(!showBrokerageFirmForm);
  const handleNewStockFormClick = () => setShowStockForm(!showStockForm);
  const handleNewStockSplitFormClick = () =>
    setShowStockSplitForm(!showStockSplitForm);

  return (
    <>
      <div className="text-black record-btn-container">
        <div
          className={`record-btn ${show ? "up-right" : ""}`}
          onClick={handleNewRecordClick}
        >
          <i className="bi bi-pen"></i>
        </div>
        <div
          className={`record-btn ${show ? "left-up" : ""}`}
          onClick={handleNewStockFormClick}
        >
          <i className="bi bi-plus-circle"></i>
        </div>
        <div
          className={`record-btn ${show ? "left-down" : ""}`}
          onClick={handleNewBrokerageFirmClick}
        >
          <i className="bi bi-bank2"></i>
        </div>
        {/* outer */}
        <div
          className={`record-btn ${show ? "up-right-sec" : ""}`}
          onClick={handleNewStockSplitFormClick}
        >
          <i className="bi bi-arrows-expand-vertical"></i>
        </div>

        {/* <div className={`record-btn ${show ? "up-middle-right-sec" : ""}`} onClick={}>
            <i className="bi bi-currency-dollar"></i>
        </div> */}

        <div className="record-btn" onClick={handleShowClick}>
          <i className="bi bi-layers"></i>
        </div>
      </div>

      <StockRecordForm
        showState={{ isShow: showRecordForm, setShow: setShowRecordForm }}
      />
      <UserStockForm
        showState={{ isShow: showStockForm, setShow: setShowStockForm }}
      />
      <BrokerageFirmForm
        showState={{
          isShow: showBrokerageFirmForm,
          setShow: setShowBrokerageFirmForm,
        }}
      />
      <StockSplitForm
        showState={{
          isShow: showStockSplitForm,
          setShow: setShowStockSplitForm,
        }}
      />

      {
        /* show the form to modifydata */
        updateStockRecordShowState && (
          <StockRecordForm
            showState={updateStockRecordShowState}
            formData={updateStockRecordFormData}
          />
        )
      }
      {bundleSellShowState && (
        <BundleSellRecord
          showState={bundleSellShowState}
          stockRecordSummarySell={stockRecordSummarySell}
        />
      )}
      {updateBundleSellShowState && (
        <BundleSellRecord
          showState={updateBundleSellShowState}
          stockRecordSummarySell={stockRecordSummarySell}
          formData={udpateBundleSellFormData}
        />
      )}

      {updateStockSellShowState && (
        <StockSellRecord
          showState={updateStockSellShowState}
          updateFormData={updateStockSellFormData}
        />
      )}
    </>
  );
}
