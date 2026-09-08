import { Button } from "@/components/ui/button";
import { UserContext } from "@/useContext/context/UserContext";
import { useContext } from "react";
import { Link } from "react-router"

export const AboutPage = () => {

    const { isAuthenticated, logout } = useContext(UserContext);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">Pagina sobre mi</h1>
            <hr />

            <div className="flex flex-col gap-2">
                {
                    isAuthenticated && (
                        <Link to="/profile">
                            Perfil
                        </Link>

                    )}

                {
                    isAuthenticated ? (
                        <Button variant="destructive" onClick={logout} >
                            Salir
                        </Button>
                    ) :
                        (<Link to="/login">
                            Iniciar sesion
                        </Link>)
                }


            </div>
        </div >
    )
}
