import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserContext } from "@/useContext/context/UserContext"
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"

export const LoginPage = () => {

    const { login } = useContext(UserContext);
    const [userId, setUserId] = useState('');
    const navigation = useNavigate();

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("🚀 ~ handleSubmit ~ event:", { userId });

        const result = login(+userId);
        console.log("🚀 ~ handleSubmit ~ result:", result);
        if (!result) {
            toast.error('Usuario no encontrado');
            return;
        }

        navigation('/profile');
    }
    return (
        <div className="flex flex-col items-center min-h-screen">
            <h1 className="text-4xl font-bold">Iniciar Sesion</h1>
            <hr />

            <form className="flex flex-col items-center"
                onSubmit={handleSubmit}>
                <Input
                    type="number"
                    placeholder="ID del usuario"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)} />
                <Button type="submit" >Login</Button>
            </form>

            <Link to="/about">
                <Button variant="ghost" >Volver a pagina principal</Button>
            </Link>
        </div>
    )
}
