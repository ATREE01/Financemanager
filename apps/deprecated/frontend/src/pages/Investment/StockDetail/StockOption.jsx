const StockOption = ({data, setStockSymbol}) => {
    return (
        <>
            <div className="stock-option-container rounded w-full h-full">
                <select className="stock-select rounded-[5vw] w-full h-full text-center bg-[#E1E1E1]" onChange={(e) => {setStockSymbol(e.target.value);} }>
                    <option value="ALL">所有股票</option>
                    {
                        data.map((item, index) =>
                            <option key={index} value={item.stock_symbol}>{item.stock_name}</option>
                        )
                    }
                </select>
            </div>
            
        </>
    )
}

export default StockOption;