const DetailTable = (props) => {// TODO: Doing this
    return (
        <table className="table-content">
            <thead>
                <tr className="table-title">
                    {props.titles.map((item, index) => <th className="table-data-cell" key={index}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {props.tableContent}
            </tbody>
        </table>
    )
}

export default DetailTable;
