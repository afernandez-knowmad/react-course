import { useEffect, useState } from "react";

const colors = {
    red: "bg-red-500 animate-pulse",
    yellow: "bg-yellow-500 animate-pulse",
    green: "bg-green-500 animate-pulse",
};

// type TrafficLightColor = "red" | "yellow" | "green";
type TrafficLightColor = keyof typeof colors;


export const useTrafficLight = () => {

    const [currentLight, setCurrentLight] = useState<TrafficLightColor>("red");
    const [countDown, setCountDown] = useState(5);

    useEffect(() => {
        if (countDown === 0) return;

        // Mala practica, no se debe de mutar el estado dentro del useEffect, ya que esto puede generar un bucle infinito
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
            setCountDown((prev) => prev - 1);
        }, 1000);

        return () => {
            clearInterval(intervalId);
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

    return {
        // Props
        countDown,
        currentLight,
        colors,

        // Computed
        percentage: (countDown / 5) * 100,
        greenLight: currentLight === "green" ? colors.green : "bg-gray-700",
        redLight: currentLight === "red" ? colors.red : "bg-gray-700",
        yellowLight: currentLight === "yellow" ? colors.yellow : "bg-gray-700",

        // Methods
    }
}
