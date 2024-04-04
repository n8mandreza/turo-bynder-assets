export default function Login({handleLogin}: {handleLogin: () => void}) {
    return (
        <div>
            <button className="surface-01 border stroke-01 rounded-lg px-3 py-2" onClick={handleLogin}>Login</button>
        </div>
    )
}