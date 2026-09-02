import { useEffect, useState } from "react";

const colors = {
    red: "bg-red-500 animate-pulse",
    yellow: "bg-yellow-500 animate-pulse",
    green: "bg-green-500 animate-pulse",
};

// type TrafficLightColor = "red" | "yellow" | "green";

type TrafficLightColor = keyof typeof colors;

export const TrafficLightWithEffect = () => {
    const [currentLight, setCurrentLight] = useState<TrafficLightColor>("red");
    const [countDown, setCountDown] = useState(5);

    useEffect(() => {
        if (countDown === 0) return;
        // if (countDown === 0) {
        //     if (currentLight === "red") {
        //         setCurrentLight("green");
        //         return;
        //     } else if (currentLight === "yellow") {
        //         setCurrentLight("red");
        //         return;
        //     } else if (currentLight === "green") {
        //         setCurrentLight("yellow");
        //         return;
        //     }
        //     return;
        // }

        const intervalId = setInterval(() => {
            console.log('Set interval llamado');
            setCountDown((prevCount) => prevCount - 1);
        }, 1000);

        return () => {
            clearInterval(intervalId);
            console.log('Cleanup del useEffect');
        }
    }, [countDown]);

    useEffect(() => {
        if (countDown > 0) return;

        setCountDown(5);

        if (currentLight === "red") {
            setCurrentLight("green");
            return;
        } else if (currentLight === "yellow") {
            setCurrentLight("red");
            return;
        } else if (currentLight === "green") {
            setCurrentLight("yellow");
            setCountDown(1);
            return;
        }

    }, [countDown, currentLight]);



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-8">
                <h1 className="text-3xl font-bold text-white">Semaforo con useEffect</h1>
                <h2 className="text-xl text-gray-300">Color actual: {currentLight}</h2>
                <h2 className="text-xl text-gray-300">Tiempo restante: {countDown}</h2>

                <div className="w-64 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${(countDown / 5) * 100}%` }}></div>
                </div>

                <div className={`w-32 h-32 ${currentLight === 'red' ? colors[currentLight] : 'bg-gray-700'} rounded-full`}></div>
                <div className={`w-32 h-32 ${currentLight === 'yellow' ? colors[currentLight] : 'bg-gray-700'} rounded-full`}></div>
                <div className={`w-32 h-32 ${currentLight === 'green' ? colors[currentLight] : 'bg-gray-700'} rounded-full`}></div>
            </div>
        </div>
    );
};