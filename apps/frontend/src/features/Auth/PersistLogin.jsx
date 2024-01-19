import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, selectCurrentToken } from "./AuthSlice";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);

    useEffect(() => {
        let isMounted = true;
        
        const verifyRefreshToekn = async () => {
            try{
                const result = await fetch('/api/Refresh/',{
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });

                console.log(result);
                const json = await result.json();
                dispatch(setCredentials({...json}));
            }
            catch(err){
                console.log(err); 
            }
            finally{
                isMounted && setIsLoading(false);
            }
        }
        localStorage.getItem('lgdi') === '1' && token === null ? verifyRefreshToekn() : setIsLoading(false);

        return () => isMounted = false;
    }, [token, dispatch])

    return (
        <>
            {isLoading ? <p>Loading...</p> : <Outlet />}
        </>
    )
}

export default PersistLogin;