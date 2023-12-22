import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogOutMutation } from "../../features/Auth/AuthApiSlice";
import { selectCurrentToken, selectCurrentUser, resetCredentials } from "../../features/Auth/AuthSlice"; 
import './NavBar.css';

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
            <div className="topbar fl ali_c">
                <div className="Link"><Link to='/'> Home</Link></div>
                <div className="flex_1"></div>
                <div className="fl ali_c">
                    {username !== null ? <div className="Link"> <Link to='Dashboard'> {username} </Link> </div> : null}
                    {username === null ? <div className="Link"><Link to='/Login'>Login</Link></div> : null}
                    {username !== null ? <div className="Link"><Link to='/#' onClick={async () => {
                        await logOut();
                        dispatch(resetCredentials());
                        localStorage.removeItem('lgdi');
                    }}>Logout</Link></div> : null}
                </div>
            </div>
            <div style={{paddingBottom:'35px'}}></div>
            <Outlet/>
        </>
        :
        <> {/* logged in */}
        <div className="topbar fl ali_c">
            <div className="Link"><Link to='#' onClick={showSidebar}> <i className="bi bi-list"></i></Link></div>
            <div className="Link"><Link to='/'> Home</Link></div>
            <div className="flex_1"></div>
            <div className="fl ali_c">
                {username !== null ? <div className="Link"> <Link to='Dashboard'> {username} </Link> </div> : null}
                {username === null ? <div className="Link"><Link to='/Login'>Login</Link></div> : null}
                {username !== null ? <div className="Link"><Link to='/#' onClick={async () => {
                    await logOut();
                    dispatch(resetCredentials());
                    localStorage.removeItem('lgdi');
                }}>Logout</Link></div> : null}
            </div>
        </div>

        <nav className={`sidebar ${activate ? 'activate': ""}`}>
            <div className="sidebar-header">
                <Link to="#" className="sidebar-toggle" onClick={showSidebar} > <i className="bi bi-list"></i></Link>
            </div>
            <div className="sidebar-container">
                { SidebarData.map((item, index) => <SidebarItem key={index} item={item} onClick={showSidebar}/>) }
            </div>
        </nav>
        {activate ? <div className="sidebar-scrim" onClick={showSidebar}></div> : ""}
        <div style={{paddingBottom:'35px'}}></div>

        <Outlet/>
    </>
    )
}