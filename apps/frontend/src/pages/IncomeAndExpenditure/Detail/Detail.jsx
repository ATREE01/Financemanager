import './Detail.css'
import '../../../assets/table.css'
import '../Inc_Exp.css';//其實可以不用寫這行，但是這樣邏輯上來說比較清楚。
import { useState } from 'react'

import { useGetRecordQuery, useGetCategoryQuery } from '../../../features/IncExp/IncExpApiSlice';
import { useGetBankQuery } from '../../../features/Bank/BankApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';
import FilterOption from './FilterOption';
import PageLabel from '../../../components/PageLabel/PageLabel';
import FormIncExp from "../FormIncExp/FormIncExp";
import DetailTable from '../../../components/DetailTable/DetailTable';

const Detail = () => {
    const user_id = useSelector(selectCurrentUserId);
    const [duration, setDuration] = useState("week");
    const [type, setType] = useState("default");
    const [category, setCategory] = useState("default");
    const [currency, setCurrency] = useState("default");
    const [method, setMethod] = useState("default");
    const [bank, setBank] = useState("default");

    const {
        data: categoryData,
        isLoading: catIsLoading,
        isSuccess: catIsSuccess
    } = useGetCategoryQuery();

    const {
        data: banks,
        isLoading: bankIsLoading,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({user_id});

    const {
        data: record,
        isLoading: recIsLoading,
        isSuccess: recIsSuccess
    } = useGetRecordQuery({user_id, duration, type, category, currency, method, bank});
    let tableContent, filterContent;

    const titles = ["日期", "類別", "種類", "金額", "幣別", "方法", "金融機構", "手續費", "備註"];
    const phraseMap = {
        type:{
            default: "選擇類別",  
            income: "收入",
            expenditure: "支出"
        },
        category:{
            default: "選擇種類",  
        },
        currency:{
            default: "選擇幣別",  
            TWD: "台幣"
        },
        method:{
            default: "選擇方式",  
            cash: "現金交易",
            finance: "金融交易",
            credit: "信用卡"
        },
        bank:{
            default: "選擇金融機構",  
        }
    } 
    if(catIsLoading || bankIsLoading){
            filterContent = <div>Loading...</div>
        }
        else if(catIsSuccess && bankIsSuccess){
            categoryData.IncomeCategoryData.forEach(element => phraseMap['category'][element.value] = element.name);
        categoryData.ExpenditureCategoryData.forEach(element => phraseMap['category'][element.value] = element.name);
        banks.forEach(element => phraseMap['bank'][element['bank_id']] = element['name']);
        const filterData = {
            type:Object.keys(phraseMap['type']).map(item => ({value: item, name:phraseMap['type'][item]})),
            category:Object.keys(phraseMap['category']).map(item => ({value: item, name:phraseMap['category'][item]})),
            currency:Object.keys(phraseMap['currency']).map(item => ({value: item, name:phraseMap['currency'][item]})),
            method:Object.keys(phraseMap['method']).map(item => ({value: item, name:phraseMap['method'][item]})),
            bank:phraseMap['bank'] ? Object.keys(phraseMap['bank']).map(item => ({value: item, name:phraseMap['bank'][item]})) : ""
        }
        filterContent = <>
            <FilterOption data={filterData['type']} setfilter={setType}/>
            <FilterOption data={filterData['category']} setfilter={setCategory} />
            <FilterOption data={filterData['currency']} setfilter={setCurrency}/>
            <FilterOption data={filterData['method']} setfilter={setMethod}/>
            <FilterOption data={filterData['bank']}  setfilter={setBank}/>
        </>
    }
    if(recIsLoading){
        tableContent = <tr><td>Loading...</td></tr>
    } else if(recIsSuccess && catIsSuccess){
        console.log(record);
        tableContent = record.map((item, index) => { return(
            <tr className='table-recordRow' key={index}>
                <td className='table-data-cell'>{item.date}</td>
                <td className='table-data-cell'>{phraseMap['type'][item.type]}</td>
                <td className='table-data-cell'>{phraseMap['category'][item.category]}</td>
                <td className='table-data-cell number'>{item.amount}</td>
                <td className='table-data-cell'>{phraseMap['currency'][item.currency]}</td>
                <td className='table-data-cell'>{phraseMap['method'][item.method]}</td>
                <td className='table-data-cell'>{phraseMap['bank'][item.bank_id]}</td>    
                <td className='table-data-cell'>{item.charge}</td>
                <td className='table-data-cell'>{item.note}</td>
            </tr>
        )});
    }


    return (
        <>
            <PageLabel title={"收支紀錄:明細"}/>
            <div className="Detail-Inc-Exp-container">
                {/*TODO: add the funciton to revise/delete the record */}
                {/* TODO: add a column to display the total amount base on the filter */}
                <div className='Detail-Inc-Exp-content'> 

                    <div className='duration-options-container'>
                            <div className={`duration-option ${duration === "default" ? "selected" : ""}`} onClick={() => setDuration("default")}>不限</div>
                            <div className={`duration-option ${duration === "week" ? "selected" : ""}`} onClick={() => setDuration("week")}>近一周</div>
                            <div className={`duration-option ${duration === "month" ? "selected" : ""}`} onClick={() => setDuration("month")} >近一個月</div>
                            <div className={`duration-option ${duration === "3month" ? "selected" : ""}`} onClick={() => setDuration("3month")}>近三個月</div>
                            <div className={`duration-option ${duration === "YTD" ? "selected" : ""}`} onClick={() => setDuration("YTD")}>今年至今</div>
                            <div className={`duration-option ${duration === "other" ? "selected" : ""}`}>自訂</div> {/* //TODO: implement this*/}
                    </div>

                    <div className='Detail-IE-filter-contanier'>
                        {filterContent}
                    </div>

                    <div className='table-container'>
                        <DetailTable 
                            titles={titles}
                            tableContent={tableContent}
                        />
                    </div>
                    <FormIncExp />
                </div>
            </div>
        </>
    )
}

export default Detail;