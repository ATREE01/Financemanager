const FilterOption = ({data, setfilter}) =>{

    return (
        <>
            <div className="filter-option-container">
                <select className="filter-select max-h-20" onChange={(e) => {setfilter(e.target.value);} }>
                    {
                        data.map((item, index) => <option className="filter-option" key={index} value={item.value}>{item.name}</option>)
                    }
                </select>
            </div>
            
        </>
    )
}

export default FilterOption;