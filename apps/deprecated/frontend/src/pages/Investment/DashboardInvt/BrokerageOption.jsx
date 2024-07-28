const BrokerageOption = ({data, setBrokerage}) => {
    return (
        <>
            <div className="brokerage-option-container rounded w-full h-full">
                <select className="brokerage-select rounded-[5vw] w-full h-full text-center bg-[#E1E1E1]" onChange={(e) => {setBrokerage(e.target.value);} }>
                    <option value="ALL">所有券商</option>
                    {
                        data.map((item, index) =>
                            <option key={index} value={item.brokerage_id}>{item.name}</option>
                        )
                    }
                </select>
            </div>
            
        </>
    )
}

export default BrokerageOption;