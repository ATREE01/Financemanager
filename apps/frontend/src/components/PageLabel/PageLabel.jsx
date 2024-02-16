const PageLabel = ({title}) =>{
    return (
        <div className='label bg-slate-400 w-36 h-12 rounded-r-lg flex items-center justify-center shadow'>   
            <div className='title text-xl font-bold'>{title}</div>
        </div>
    )
}

export default PageLabel;