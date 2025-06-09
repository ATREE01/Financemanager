import {
  CurrencyTransactionRecord,
  ShowState,
} from "@financemanager/financemanager-website-types";
import { useState } from "react";

import CurrencyTransactionRecordForm from "@/app/components/forms/currency-transaction-form-manager/record";
export default function CurrenyTransactionFormManager({
  updateShowState,
  formData,
}: {
  updateShowState: ShowState | null;
  formData?: CurrencyTransactionRecord | null;
}) {
  const [show, setShow] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);

  const handleShowClick = () => setShow(!show);
  const handleNewRecordClick = () => setShowRecordForm(!showRecordForm);

  return (
    <>
      <div className={`text-black record-btn-container`}>
        <div
          className={`record-btn ${show ? "up-right" : ""}`}
          onClick={handleNewRecordClick}
        >
          <i className="bi bi-pen"></i>
        </div>

        <div className="record-btn" onClick={handleShowClick}>
          <i className="bi bi-layers"></i>
        </div>
      </div>
      <CurrencyTransactionRecordForm
        showState={{ isShow: showRecordForm, setShow: setShowRecordForm }}
      />

      {
        /* show the form to modifydata */
        updateShowState && (
          <CurrencyTransactionRecordForm
            showState={updateShowState}
            formData={formData}
          />
        )
      }
    </>
  );
}
