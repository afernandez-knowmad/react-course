import type { FC } from "react";

interface PreviousSearchesProps {
    searches: string[];
    onLabelClicked?: (term: string) => void;
}

export const PreviousSearches: FC<PreviousSearchesProps> = ({ searches, onLabelClicked }: PreviousSearchesProps) => {
    return (
        <div className='previous-searches'>
            <h2>Busquedas Anteriores</h2>
            <ul className='previous-searches-list'>
                {searches.map((search, index) => (
                    <li key={index} onClick={() => onLabelClicked && onLabelClicked(search)}>
                        {search}
                    </li>
                ))}
            </ul>
        </div>
    )
}


