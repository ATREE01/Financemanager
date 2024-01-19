import "./Currency.css";
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
        data: CurrencyList,
        isLoading: curIsLoading,
        isSuccess: curIsSuccess
    } = useGetExchangeRateQuery()
    
    const {
        data: UserCurrency,
        isLoading: userCurIsLoading,
        isSuccess: userCurIsSuccess
    } = useGetUserCurrencyQuery({ user_id });
    console.log(UserCurrency);

    const handleOnChange = async (e, item) =>{
        const value = e.target.checked;
        const code = item['code'];
        if(value === true){
            const result = await AddUserCurrency({user_id, code}).unwrap();
            console.log(result);
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

    if(curIsLoading || userCurIsLoading){
        CurrencyContent = 
        <>
            Loading...
        </>
    }
    if(curIsSuccess && userCurIsSuccess){
        let selectedCur = {};
        UserCurrency.forEach(item => {
            selectedCur[item['code']] = true;
        })
        const CurrencyTable = CurrencyList.map((item, index) =>  
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
        <>
            <PageLabel title={"外幣管理"}/>
            <div className="curreny-container">
                <div className="currency-content">
                    <div className="currency-table-container">
                        {CurrencyContent}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Currency;