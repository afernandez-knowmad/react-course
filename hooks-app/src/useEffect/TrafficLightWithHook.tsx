// import { useEffect, useState } from "react";

import { useTrafficLight } from "../hooks/useTrafficLight";

export const TrafficLightWithHook = () => {
    const { countDown, currentLight, percentage, redLight, yellowLight, greenLight } = useTrafficLight();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-8">
                <h1 className="text-3xl font-bold text-white">Semaforo con useEffect</h1>
                <h2 className="text-xl text-gray-300">Color actual: {currentLight}</h2>
                <h2 className="text-xl text-gray-300">Tiempo restante: {countDown}</h2>

                <div className="w-64 bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                </div>

                <div className={`w-32 h-32 ${redLight} rounded-full`}></div>
                <div className={`w-32 h-32 ${yellowLight} rounded-full`}></div>
                <div className={`w-32 h-32 ${greenLight} rounded-full`}></div>
            </div>
        </div>
    );
};