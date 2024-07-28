const CurrencyOption = ({data, setCurrency}) => {

    return (
        <>
            <div className="currency-option-container rounded w-full h-full">
                <select className="currency-select bg-primary-200 rounded-[5vw] w-full h-full text-center" onChange={(e) => {setCurrency(e.target.value);} }>
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