import { useCallback, useState } from "react"
import { MyTitle } from "./ui/MyTitle"
import { MySubitle } from "./ui/MySubtitle copy";

export const MemoHook = () => {
    const [title, setTitle] = useState('Hola');
    const [subtitle, setSubitle] = useState('mundo');

    const handleMyAPICall = useCallback(() => {
        console.log('Call API memo', subtitle);
    }, [subtitle]);

    return (
        <div className="bg-gradient flex flex-col gap-4">
            <h1 className="text-2xl font-thin text-white">MemoApp</h1>

            <MyTitle title={title} />
            <MySubitle subtitle={subtitle} callMyApi={handleMyAPICall} />

            <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={() => setTitle('Jelou')}>Cambiar titulo</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={() => setSubitle('World')}>Cambiar subtitulo</button>
        </div>
    )
}
