import { useState } from "react"
import { NavLink, Link } from "react-router-dom"

export default function SidebarItem({item, onClick}){
    const [open, setOpen] = useState(false)

    if(item.childrens){
        return (
            <div className="sidebar-item">
                <Link to='#' className="sidebar-item sidebar-item-toggle" onClick={() => setOpen(!open)}>
                    {item.title}
                    <i className="bi bi-caret-down-fill"></i>
                </Link>
                <div className={`sidebar-container ${open ? "open" : ""}`}>
                    { item.childrens.map((child, index) => <SidebarItem key={index} item={child} onClick={onClick} />) }
                </div>
            </div>
        )
    }else{
        return (
            <NavLink className="sidebar-item" to={item.path} onClick={onClick} >{item.title}</NavLink>
        )
    }
}