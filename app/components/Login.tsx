import { useContext } from "react"
import { AuthContext, IAuthContext } from "react-oauth2-code-pkce"

export default function Login() {
    const { tokenData, token, login, logOut, idToken, error }: IAuthContext = useContext(AuthContext)
    
    return (
        <div>
            <button className="surface-01 border stroke-01 rounded-lg px-3 py-2" onClick={() => login('state')}>Login</button>
        </div>
    )
}