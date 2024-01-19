const CurrencyOption = ({data, setCurrency}) => {

    return (
        <>
            <div className="currency-option-container rounded w-full h-full">
                <select className="currency-select rounded-[5vw] w-full h-full text-center bg-[#E1E1E1]" onChange={(e) => {setCurrency(e.target.value);} }>
                    <option value='TWD'>台幣</option>
                    {
                        Object.keys(data).map(key => 
                            <option key={key} value={key}>{data[key]}</option>
                        )
                    }
                </select>
            </div>
            
        </>
    )
}

export default CurrencyOption;