import { useState } from "react";

const colors = {
    red: "bg-red-500 animate-pulse",
    yellow: "bg-yellow-500 animate-pulse",
    green: "bg-green-500 animate-pulse",
};

// type TrafficLightColor = "red" | "yellow" | "green";

type TrafficLightColor = keyof typeof colors;

export const TrafficLight = () => {
    const [currentLight, setCurrentLight] = useState<TrafficLightColor>("red");

    const handleLightChange = (light: TrafficLightColor) => {
        setCurrentLight(light);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-8">
                <div className={`w-32 h-32 ${currentLight === 'red' ? colors[currentLight] : 'bg-gray-700'} rounded-full`}></div>
                <div className={`w-32 h-32 ${currentLight === 'yellow' ? colors[currentLight] : 'bg-gray-700'} rounded-full`}></div>
                <div className={`w-32 h-32 ${currentLight === 'green' ? colors[currentLight] : 'bg-gray-700'} rounded-full`}></div>

                {/* Botón para cambiar el estado de la luz */}
                <div className="flex gap-2">
                    <button
                        onClick={() => handleLightChange("red")}
                        className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer">
                        Rojo
                    </button>
                    <button
                        onClick={() => handleLightChange("yellow")}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md cursor-pointer">
                        Amarillo
                    </button>
                    <button
                        onClick={() => handleLightChange("green")}
                        className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer">
                        Verde
                    </button>
                </div>
            </div>
        </div>
    );
};