import {
  ShowState,
  TimeDepositRecord,
} from "@financemanager/financemanager-website-types";
import { useState } from "react";

import TimeDepositRecordForm from "@/app/components/forms/time-deposit-manager/record/index";

export default function TimeDepositRecordFormManager({
  updateShowState,
  formData,
}: {
  updateShowState: ShowState | null;
  formData?: TimeDepositRecord | null;
}) {
  const [show, setShow] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);

  const handleShowClick = () => setShow(!show);
  const handleNewRecordClick = () => setShowRecordForm(!showRecordForm);

  return (
    <>
      <div className="text-black record-btn-container">
        <div
          className={`record-btn ${show ? "up-right" : ""}`}
          onClick={handleNewRecordClick}
        >
          <i className="bi bi-pen"></i>
        </div>
        {/* <div
            className={`${styles["record-btn"]} ${show ? styles["left-up"] : ""}`}
            onClick={handleNewCategoryClick}
            >
            <i className="bi bi-plus-circle"></i>
            </div>
            <div className={`record-btn ${show ? styles["left-down"] : ""}` } onClick={handleManageCategoryClick}>
                        <i className="bi bi-gear"></i>
                    </div> */}
        <div className="record-btn" onClick={handleShowClick}>
          <i className="bi bi-layers"></i>
        </div>
      </div>
      <TimeDepositRecordForm
        showState={{ isShow: showRecordForm, setShow: setShowRecordForm }}
      />

      {
        /* show the form to modifydata */
        updateShowState && (
          <TimeDepositRecordForm
            showState={updateShowState}
            formData={formData}
          />
        )
      }
    </>
  );
}
