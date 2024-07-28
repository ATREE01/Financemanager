import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../features/Auth/AuthSlice";

export default function Home(){ 

    const user_id = useSelector(selectCurrentUserId);

    return (
        <div className="bg-slate-100 py-5 min-h-screen">
            <div className="content text-center">
                <h1>This is Home page of my financemanager web</h1>
                <h2>There should be some introudction on this page.</h2>
                <p>Since I'm bad at art class. So I don't know what I can do to make this page more beautiful.</p>
            </div>
        </div>
    )
}

