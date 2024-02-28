import PageLabel from "../../components/PageLabel/PageLabel";
import DetailTable from "../../components/DetailTable/DetailTable";
import { useDeleteUserCurrencyMutation, useGetExchangeRateQuery, useGetUserCurrencyQuery, useAddUserCurrencyMutation } from "../../features/Currency/CurrencyApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../features/Auth/AuthSlice";

const Currency = () => {

    const titles = ["勾選", "代號", "名稱", "匯率"]

    const user_id = useSelector(selectCurrentUserId);
    const [ AddUserCurrency ] = useAddUserCurrencyMutation();
    const [ deleteUserCurrency ] = useDeleteUserCurrencyMutation();

    const {
        data: exRate,
        isLoading: exRateIsLoading,
        isSuccess: exRateIsSuccess
    } = useGetExchangeRateQuery()
    
    const {
        data: UserCurrency,
        isLoading: userCurIsLoading,
        isSuccess: userCurIsSuccess
    } = useGetUserCurrencyQuery({ user_id });

    const handleOnChange = async (e, item) =>{
        const value = e.target.checked;
        const code = item['code'];
        if(value === true){
            const result = await AddUserCurrency({user_id, code}).unwrap();
            if(result['isSuccess']){
                window.alert("新增成功");
            }
        } else if(value === false){
            const result = await deleteUserCurrency({user_id, code}).unwrap();
            if(result['isSuccess']){
                window.alert("刪除成功");
            }
        }
    }
    
    let CurrencyContent = null

    if(exRateIsLoading || userCurIsLoading){
        CurrencyContent = 
        <>
            Loading...
        </>
    }
    if(exRateIsSuccess && userCurIsSuccess){
        let selectedCur = {};
        UserCurrency.forEach(item => {
            selectedCur[item['code']] = true;
        })
        const CurrencyTable = exRate.slice(1).map((item, index) =>  
            <tr key={index}>
                <td className="table-data-cell text-center"><input onChange={(e) => handleOnChange(e, item)} type="checkbox" checked={selectedCur[item['code']] ?? 0} /></td>
                <td className='table-data-cell text-center'>{item['code']}</td>
                <td className='table-data-cell text-center'>{item['name']}</td>
                <td className='table-data-cell number'>{item['ExchangeRate']}</td>
            </tr>
        )
        CurrencyContent = <DetailTable titles={titles} tableContent={CurrencyTable} />
    }
    return (
        <div className="bg-slate-100 py-5 min-h-screen">
            <PageLabel title={"外幣管理"}/>
            <div className="curreny-container max-h-full">
                <div className="currency-content h-full mt-4 flex flex-col items-center">
                    <div className="table-container w-2/5">
                        {CurrencyContent}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Currency;