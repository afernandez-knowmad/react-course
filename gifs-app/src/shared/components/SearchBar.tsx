import { useEffect, useState } from "react";

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
}

export const SearchBar = ({ placeholder = 'Buscar', onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
        // setQuery('');
    };

    const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && query.trim() !== '') {
            handleSearch();
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(query);
            console.log('SearchBar mounted');
        }, 700);

        return () => {
            clearTimeout(timeoutId);
            console.log('SearchBar unmounted');
        }
    }, [query, onSearch]);

    return (
        <div className='search-container'>
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeydown} />
            <button onClick={handleSearch}>Buscar</button>
        </div>
    )
}
