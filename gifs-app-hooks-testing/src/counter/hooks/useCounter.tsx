import { useState } from 'react'

export const useCounter = (initialValue: number = 7) => {
    const [counter, setCounter] = useState(initialValue);

    const handleAdd = () => {
        setCounter((prevCounter) => prevCounter + 1);
    };

    const handleSubtract = () => {
        setCounter((prevCounter) => prevCounter - 1);
    };

    const handleReset = () => {
        setCounter(initialValue);
    };

    return { counter, handleAdd, handleSubtract, handleReset };
}
