import { use, type Usable } from "react"
import { type User } from "./api/get-user.action"


interface Props {
    getUser: Usable<User>
}
// const userPromise = getUserAction(1);

export const ClientInformation = ({ getUser }: Props) => {

    const user = use(getUser);
    // useEffect(() => {
    //     getUserAction(id).then(console.log)
    // }, [id]);

    return (
        <div className="bg-gradient flex flex-col gap-4">
            <h2 className="text-2xl text-white">{user.name} - #{user.id}</h2>
            <p className="text-xl text-white">{user.location}</p>
            <p className="text-xl text-white">{user.role}</p>
        </div>
    )
}
