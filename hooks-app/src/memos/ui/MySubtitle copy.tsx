import React from "react";

interface Props {
    subtitle: string;
    callMyApi: () => void
}
export const MySubitle = React.memo(({ subtitle, callMyApi }: Props) => {
    console.log("🚀 ~ MySubtitle ~ subtitle:", subtitle)

    return (
        <>
            <h6 className="text-2xl font-bold">{subtitle}</h6>

            <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={callMyApi}>Llamar a funcion</button>
        </>
    )
})
