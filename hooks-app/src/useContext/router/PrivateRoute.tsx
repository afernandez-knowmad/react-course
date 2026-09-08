import { use } from "react"
import type { JSX } from "react/jsx-runtime"
import { UserContext } from "../context/UserContext"
import { Navigate } from "react-router"

interface Props {
    element: JSX.Element // React.ReactNode
}
export const PrivateRoute = ({ element }: Props) => {

    const { authStatus } = use(UserContext);

    if (authStatus === 'checking') {
        return <div>Loading...</div>;
    }

    if (authStatus === 'authenticated') {
        return element;
    }

    return <Navigate to="/login" replace />
}
