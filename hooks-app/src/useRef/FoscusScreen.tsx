import { useRef } from "react"

export const FoscusScreen = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        console.log("🚀 ~ onClick ~ inputRef.current.value;:", inputRef?.current?.value);
        inputRef?.current?.focus()
    }

    return (
        <div className="bg-gradient flex flex-col gap-4">
            <h1 className="txt-2xl font-thin text-white">Focus Screen</h1>
            <input ref={inputRef} type="text" className="bg-white text-black px-4 py-2 rounded-md" autoFocus />

            <button onClick={handleClick} className=" bg-blue-500 text-white px-4 py-2 rounded-md">Set Focus</button>
        </div>
    )
}
