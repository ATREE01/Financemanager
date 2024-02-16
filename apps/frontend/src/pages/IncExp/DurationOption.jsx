import { useState } from "react";

const DurationOption = ({Duration, startDate, endDate}) => {

    const [ show, setShow ] = useState(false);
    return(
        <div className='duration-options-container flex flex-wrap justify-center z-10'>
            <div className={`duration-option w-24 bg-primary-200 cursor-pointer hover:brightness-75 ${Duration.data === "default" ? "brightness-75" : ""}`} onClick={() => {Duration.setData("default");  setShow(false)}}>不限</div>
            <div className={`duration-option w-24 bg-primary-200 cursor-pointer hover:brightness-75 ${Duration.data === "7" ? "brightness-75" : ""}`} onClick={() =>  {Duration.setData("7"); setShow(false)}}>近一周</div>
            <div className={`duration-option w-24 bg-primary-200 cursor-pointer hover:brightness-75 ${Duration.data === "30" ? "brightness-75" : ""}`} onClick={() =>  {Duration.setData("30"); setShow(false)}}>近一個月</div>
            <div className={`duration-option w-24 bg-primary-200 cursor-pointer hover:brightness-75 ${Duration.data === "90" ? "brightness-75" : ""}`} onClick={() =>  {Duration.setData("90"); setShow(false)}}>近三個月</div>
            <div className={`duration-option w-24 bg-primary-200 cursor-pointer hover:brightness-75 ${Duration.data === "YTD" ? "brightness-75" : ""}`} onClick={() =>  {Duration.setData("YTD"); setShow(false)}}>今年至今</div>
            <div className={`duration-option bg-primary-200 relative w-24 cursor-pointer`}  onClick={() => {Duration.setData("customize");setShow(!show)}} >自訂
                {Duration.data === 'customize' && show && (
                    <div className="absolute top-10 rounded bg-slate-200 p-2 brightness-100 w-40 text-center" onClick={(e) => e.stopPropagation()}>
                        <div>
                            <label>起:</label>
                            <input className="bg-slate-400 rounded m-1" type="date" value={startDate.data} onChange={(e) => startDate.setData(e.target.value)}/>
                        </div>
                        <div>
                            <label>迄:</label>
                            <input className="bg-slate-400 rounded m-1" type="date" value={endDate.data}  onChange={(e) => endDate.setData(e.target.value)}/>
                        </div>
                        <button className="bg-slate-400 hover:bg-slate-600 border-black rounded w-10 h-6" onClick={() => setShow(!show)}>確定</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DurationOption;