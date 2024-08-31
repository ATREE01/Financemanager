import {
  CurrencyTransactionRecord,
  ShowState,
} from "@financemanager/financemanager-webiste-types";
import { useState } from "react";

import CurrencyTransactionRecordForm from "@/app/components/forms/currency-transaction-form-manager/record";
import styles from "@/app/components/forms/form.module.css";

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
      <div className={`text-black ${styles["record-btn-container"]}`}>
        <div
          className={`${styles["record-btn"]} ${show ? styles["up-right"] : ""}`}
          onClick={handleNewRecordClick}
        >
          <i className="bi bi-pen"></i>
        </div>

        <div className={styles["record-btn"]} onClick={handleShowClick}>
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
