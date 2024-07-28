import { useState } from "react"
import { NavLink, Link } from "react-router-dom"

export default function SidebarItem({item, onClick}){
    const [open, setOpen] = useState(false)

    if(item.childrens){
        return (
            <div className={`sidebar-item py-1 mx-2 my-1 block rounded ${open ? "bg-primary-300" : ""}`}>
                {/* "sidebar-item sidebar-item-toggle" */}
                <div className="sidebar-item py-2 mx-2 my-1 cursor-pointer rounded text-xl font-bold hover:bg-primary-500" onClick={() => setOpen(!open)}>
                    {item.title}
                    <i className="bi bi-caret-down-fill"></i>
                </div>
                <div className={`sidebar-container rounded ${open ? "block" : "hidden"}`}>
                    { item.childrens.map((child, index) => <SidebarItem key={index} item={child} onClick={onClick} />) }
                </div>
            </div>
        )
    }else{
        return (
            <NavLink className={({isActive}) => `sidebar-item py-2 mx-2 my-1 block text-xl rounded hover:bg-primary-500 ${isActive ? " bg-primary-500 rounded" : ""}`} to={item.path} onClick={onClick} >{item.title}</NavLink>
        )
    }
}