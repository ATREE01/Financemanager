import {
  IncExpRecord,
  ShowState,
} from "@financemanager/financemanager-webiste-types";
import { useState } from "react";

import CategoryForm from "@/app/components/forms/inc-exp-form-manager/category";
import IncExpRecordForm from "@/app/components/forms/inc-exp-form-manager/record";

export default function IncExpFormManager({
  updateShowState,
  formData,
}: {
  updateShowState: ShowState | null;
  formData?: IncExpRecord | null;
}) {
  const [show, setShow] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showRecordForm, setShowRecordForm] = useState(false);
  // const [showManageCategory, setShowManageCategory ] = useState(false);

  const handleShowClick = () => setShow(!show);
  const handleNewRecordClick = () => setShowRecordForm(!showRecordForm);
  const handleNewCategoryClick = () => setShowCategoryForm(!showCategoryForm);
  // const handleManageCategoryClick = () => setShowManageCategory(!showManageCategory);

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
          onClick={handleNewCategoryClick}
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
      <IncExpRecordForm
        showState={{ isShow: showRecordForm, setShow: setShowRecordForm }}
      />
      <CategoryForm
        showState={{ isShow: showCategoryForm, setShow: setShowCategoryForm }}
      />

      {
        /* show the form to modifydata */
        updateShowState && (
          <IncExpRecordForm showState={updateShowState} formData={formData} />
        )
      }
    </>
  );
}
