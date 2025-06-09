import {
  BankRecord,
  ShowState,
} from "@financemanager/financemanager-website-types";
import { useState } from "react";

import BankForm from "@/app/components/forms/bank-form-manager/bank";
import BankRecordFrom from "@/app/components/forms/bank-form-manager/record";

export default function BankFormManager({
  updateShowState,
  formData,
}: {
  updateShowState: ShowState | null;
  formData?: BankRecord | null;
}) {
  const [show, setShow] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);

  const handleShowClick = () => setShow(!show);
  const handleNewRecordClick = () => setShowRecordForm(!showRecordForm);
  const handleNewBankClick = () => setShowBankForm(!showBankForm);

  return (
    <>
      <div className={`text-black record-btn-container`}>
        <div
          className={`record-btn ${show ? "up-right" : ""}`}
          onClick={handleNewRecordClick}
        >
          <i className="bi bi-pen"></i>
        </div>
        <div
          className={`record-btn ${show ? "left-up" : ""}`}
          onClick={handleNewBankClick}
        >
          <i className="bi bi-plus-circle"></i>
        </div>
        {/* <div className={`record-btn ${show ? styles["left-down"] : ""}` } onClick={handleManageCategoryClick}>
                    <i className="bi bi-gear"></i>
                </div> */}
        <div className="record-btn" onClick={handleShowClick}>
          <i className="bi bi-layers"></i>
        </div>
      </div>
      <BankRecordFrom
        showState={{ isShow: showRecordForm, setShow: setShowRecordForm }}
      />
      <BankForm
        showState={{ isShow: showBankForm, setShow: setShowBankForm }}
      />

      {
        /* show the form to modify data */
        updateShowState && (
          <BankRecordFrom showState={updateShowState} formData={formData} />
        )
      }
    </>
  );
}
