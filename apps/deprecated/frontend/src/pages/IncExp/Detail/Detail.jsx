import './Detail.css'
import { useState } from 'react'

import { useGetRecordQuery, useGetCategoryQuery, useDeleteIncExpRecordMutation } from '../../../features/IncExp/IncExpApiSlice';
import { useGetBankQuery } from '../../../features/Bank/BankApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../../features/Auth/AuthSlice';
import FilterOption from './FilterOption';
import PageLabel from '../../../components/PageLabel/PageLabel';
import FormIncExp from "../FormIncExp/FormIncExp";
import DetailTable from '../../../components/DetailTable/DetailTable';
import { useGetUserCurrencyQuery } from '../../../features/Currency/CurrencyApiSlice';
import DurationOption from '../DurationOption';
import RecordForm from '../FormIncExp/RecordForm';

const Detail = () => {
    const user_id = useSelector(selectCurrentUserId);
    const [ duration, setDuration ] = useState("default");
    const [ type, setType ] = useState("default");
    const [ category, setCategory ] = useState("default");
    const [ currency, setCurrency ] = useState("default");
    const [ method, setMethod ] = useState("default");
    const [ bankFilter, setBankFilter ] = useState("default");
    const [ startDate, setStartDate ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const [ formData, setFormData ] = useState();
    const [ showModifyForm, setShowModifyForm ] = useState(false);

    const {
        data: categoryData,
        isLoading: catIsLoading,
        isSuccess: catIsSuccess
    } = useGetCategoryQuery({ user_id });

    const {
        data: bank,
        isLoading: bankIsLoading,
        isSuccess: bankIsSuccess
    } = useGetBankQuery({ user_id });

    const {
        data: userCurrency,
        isLoading: userCurIsLoading,
        isSuccess: userCurIsSuccess
    } = useGetUserCurrencyQuery({ user_id });

    const {
        data: record,
        isLoading: recIsLoading,
        isSuccess: recIsSuccess
    } = useGetRecordQuery({ user_id, duration, startDate, endDate, type, category, currency, method, bank: bankFilter });

    const titles = ["日期", "類別", "種類", "金額", "幣別", "方法", "金融機構", "手續費", "備註", "功能"];
    const phraseMap = {
        type: {
            default: "選擇類別",
            income: "收入",
            expenditure: "支出"
        },
        category: {
            default: "選擇種類",
        },
        currency: {
            default: "選擇幣別",
            TWD: "台幣"
        },
        method: {
            default: "選擇方式",
            cash: "現金交易",
            finance: "金融交易",
            credit: "信用卡"
        },
        bank: {
            default: "選擇金融機構",
        }
    }

    const [ deleteIncExpRecord ] = useDeleteIncExpRecordMutation();
    const deleteRecord = async (ID) =>{
        const del = window.confirm("是否確認刪除紀錄?");
        if(del){
            const result = await deleteIncExpRecord({ID}).unwrap();
            if(result.success === 1){
                window.alert("刪除成功");
            }
        }
    }

    let tableContent, filterContent, currencyContent;
    if (catIsLoading || bankIsLoading || userCurIsLoading) {
        filterContent = <div>Loading...</div>
    }
    else if (catIsSuccess && bankIsSuccess && userCurIsSuccess) {
        categoryData.IncomeCategoryData.forEach(element => phraseMap['category'][element.value] = element.name);
        categoryData.ExpenditureCategoryData.forEach(element => phraseMap['category'][element.value] = element.name);
        bank.forEach(element => phraseMap['bank'][element['bank_id']] = element['name']);
        currencyContent = userCurrency.forEach((element) => phraseMap['currency'][element['code']] = element['name'])

        const filterData = {
            type: Object.keys(phraseMap['type']).map(item => ({ value: item, name: phraseMap['type'][item] })),
            category: Object.keys(phraseMap['category']).map(item => ({ value: item, name: phraseMap['category'][item] })),
            currency: Object.keys(phraseMap['currency']).map(item => ({ value: item, name: phraseMap['currency'][item] })),
            method: Object.keys(phraseMap['method']).map(item => ({ value: item, name: phraseMap['method'][item] })),
            bank: phraseMap['bank'] ? Object.keys(phraseMap['bank']).map(item => ({ value: item, name: phraseMap['bank'][item] })) : ""
        }
        filterContent = <>
            <FilterOption data={filterData['type']} setfilter={setType} />
            <FilterOption data={filterData['category']} setfilter={setCategory} />
            <FilterOption data={filterData['currency']} setfilter={setCurrency} />
            <FilterOption data={filterData['method']} setfilter={setMethod} />
            <FilterOption data={filterData['bank']} setfilter={setBankFilter} />
        </>

    }
    if (recIsLoading) {
        tableContent = <tr><td>Loading...</td></tr>
    } else if (recIsSuccess && catIsSuccess) {
        tableContent = record.map((item, index) => {
            return (
                <tr className='table-recordRow' key={index}>
                    <td className='table-data-cell'>{item.date}</td>
                    <td className='table-data-cell'>{phraseMap['type'][item.type]}</td>
                    <td className='table-data-cell'>{phraseMap['category'][item.category]}</td>
                    <td className='table-data-cell number'>{item.amount}</td>
                    <td className='table-data-cell'>{phraseMap['currency'][item.currency]}</td>
                    <td className='table-data-cell'>{phraseMap['method'][item.method]}</td>
                    <td className='table-data-cell text-center'>{phraseMap['bank'][item.bank_id] ?? 'X'}</td>
                    <td className='table-data-cell'>{item.charge}</td>
                    <td className='table-data-cell'>{item.note}</td>
                    <td className="table-btn table-data-cell">
                        <button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded m-[1px]" onClick={() => {setFormData(item); setShowModifyForm(!showModifyForm)}}>修改</button>
                        <button className="bg-slate-300 hover:bg-slate-500 border-[1px] border-black rounded m-[1px]" onClick={() => deleteRecord(item.ID)}>刪除</button>
                    </td>
                </tr>
            )
        });
    }

    return (
        <div className="bg-slate-100 py-5 min-h-screen">
            <PageLabel title={"收支紀錄:明細"} />
            <div className="Detail-Inc-Exp-container">
                {/* TODO: add a column to display the total amount base on the filter */}
                <div className='Detail-Inc-Exp-content'>
                    <DurationOption Duration={{data: duration, setData: setDuration}} startDate={{data: startDate, setData: setStartDate}} endDate={{data: endDate, setData:setEndDate}} />

                    <div className='Detail-IE-filter-contanier'>
                        {filterContent}
                    </div>

                    <div className='table-container'>
                        <DetailTable
                            titles={titles}
                            tableContent={tableContent}
                        />
                    </div>
                    <FormIncExp userCurrency={{ isSuccess: userCurIsSuccess, data: userCurrency }} category={{ data: categoryData, isSuccess: catIsSuccess }} bank={{data: bank, isSuccess: bankIsSuccess}} />
                    <RecordForm showState={{isShow: showModifyForm, setShow: setShowModifyForm}} userCurrency={{ isSuccess: userCurIsSuccess, data: userCurrency }} category={{ data: categoryData, isSuccess: catIsSuccess }} bank={{data: bank, isSuccess: bankIsSuccess}} formData={formData} mode='modify'/>                 </div>
            </div>
        </div>
    )
}

export default Detail;