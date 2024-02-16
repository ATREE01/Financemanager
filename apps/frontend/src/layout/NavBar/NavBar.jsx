import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogOutMutation } from "../../features/Auth/AuthApiSlice";
import { selectCurrentToken, selectCurrentUser, resetCredentials } from "../../features/Auth/AuthSlice"; 

import { SidebarData } from "./SidebarData";
import SidebarItem from "./SidebarItem";

export default function NavBar(){
    const token = useSelector(selectCurrentToken);
    const username = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const [ logOut ] = useLogOutMutation();


    const [activate, setActivate] = useState(false);
    const showSidebar = () => setActivate(!activate);

    return (
        !token ? 
        <>  {/* not logged in */}
            <div className="topbar w-full fixed top-0 h-[35px] flex items-center z-30 bg-primary-200">
                <div className="Link p-2 font-bold "><NavLink to='/'> Home</NavLink></div>
                <div className="flex-1"></div>
                <div className="flex">
                    {username !== null ? <div className="Link font-bold p-2"> <NavLink to='Dashboard'> {username} </NavLink> </div> : null}
                    {username === null ? <div className="Link font-bold  p-2"><NavLink to='/Login'>Login</NavLink></div> : null}
                    {username !== null ? <div className="Link font-bold p-2"><NavLink to='/#' onClick={async () => {
                        await logOut();
                        dispatch(resetCredentials());
                        localStorage.removeItem('lgdi');
                    }}>Logout</NavLink></div> : null}
                </div>
            </div>
            <div style={{paddingBottom:'35px'}}></div>
            <Outlet/>
        </>
        :
        <> {/* logged in */}
            <div className="topbar w-full fixed top-0 h-[35px] flex items-center z-30 bg-primary-200">
                <div className="Link p-2"><NavLink to='#' onClick={showSidebar}> <i className="text-xl bi bi-list"></i></NavLink></div>
                <div className="Link p-2 font-bold"><NavLink to='/'> Home</NavLink></div>
                <div className="flex-1"></div>
                <div className="flex">
                    {username !== null ? <div className="Link p-2 font-bold"> <NavLink to='Dashboard'> {username} </NavLink> </div> : null}
                    {username === null ? <div className="Link p-2 font-bold"><NavLink to='/Login'>登入</NavLink></div> : null}
                    {username !== null ? <div className="Link p-2 font-bold"><NavLink to='/#' onClick={async () => {
                        await logOut();
                        dispatch(resetCredentials());
                        localStorage.removeItem('lgdi');
                    }}>Logout</NavLink></div> : null}
                </div>
            </div>

            <nav className={`sidebar fixed top-0 w-[200px] h-screen bg-primary-200 text-center float-left overflow-auto transition-all duration-250 z-50 ${activate ? "left-0": "left-[-200px]"}`}>
                <div className="sidebar-header h-[35px] bg-primary-400 flex justify-end">
                    <NavLink to="#" className="sidebar-toggle m-1 rounded hover:bg-primary-600 flex items-center" onClick={showSidebar} > <i className="text-xl bi bi-list"></i></NavLink>
                </div>
                <div className="sidebar-container m-0">
                    { SidebarData.map((item, index) => <SidebarItem key={index} item={item} onClick={showSidebar}/>) }
                </div>
            </nav>
            {activate ? <div className="sidebar-scrim fixed w-screen h-screen z-40" onClick={showSidebar}></div> : ""}
            <div className="pb-[35px]"></div>

            <Outlet/>
        </>
    )
}