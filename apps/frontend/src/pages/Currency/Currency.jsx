import "./Currency.css";
import PageLabel from "../../components/PageLabel/PageLabel";
import DetailTable from "../../components/DetailTable/DetailTable";

const Currency = () => {

    const titles = ["代號", "名稱"]

    return (
        <>
            <PageLabel title={"外幣管理"}/>
            <div className="curreny-container">
                <div className="currency-content">
                    <div className="currency-table-container">
                        <DetailTable titles={titles} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Currency;