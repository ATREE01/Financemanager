import './Home.css'

export default function Home(){ 
    const handleClick = () => {
        fetch('/api/Test/',{
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                HELLO: "HELLO"
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    }

    return (
        <div className="content">
            <h1>This is Home Page</h1>
            <h2>There should be some introudction on this page.</h2>
            <h3 style={{color: "red"}}>solve the problem that user can still go to login page when user already logged in</h3>
            <button onClick={handleClick}>This is a test button</button>
        </div>
    )
}

