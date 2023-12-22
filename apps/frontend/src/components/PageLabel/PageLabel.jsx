import "./PageLabel.css"

const PageLabel = ({title}) =>{
    return (
        <div className='label'>   
            <div className='title'>{title}</div>
        </div>
    )
}

export default PageLabel;