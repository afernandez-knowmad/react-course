import { useState } from 'react'
import { CustomHeader } from '../../shared/components/CustomHeader'
import { PreviousSearches } from '../../shared/components/PreviousSearches'
import { SearchBar } from '../../shared/components/SearchBar'
import { GifsList } from './GifsList'
import { getGifsByQuery } from '../actions/get-gifs-by-query.actions'
import type { Gif } from '../interfaces/gif.interface'

export const GifsApp = () => {

    const [gifs, setGifs] = useState<Gif[]>([]);
    const [previousTerms, setPreviousTerm] = useState<string[]>(['drangon ball', 'pokemon', 'naruto']);

    const handleTermClicked = async (term: string) => {
        console.log(`Term clicked: ${term}`);

        term = term.trim().toLocaleLowerCase();
        if (term === '') return;

        setPreviousTerm([term, ...previousTerms.filter(t => t !== term)]);

        const foundGifs = await getGifsByQuery(term);
        setGifs(foundGifs);
    };

    const handleSearch = async (search: string) => {
        search = search.trim().toLocaleLowerCase();
        if (search === '') return;

        if (previousTerms.includes(search)) return;

        setPreviousTerm([search, ...previousTerms.slice(0, 7)]);

        const foundGifs = await getGifsByQuery(search);
        setGifs(foundGifs);
    };

    return (
        <>
            { /* Header */}
            <CustomHeader title="Buscador de Gifs" subtitle="Encuentra los mejores gifs aquí" />

            { /* Search */}
            <SearchBar placeholder='Escribe para buscar un gif' onSearch={handleSearch} />

            { /* Previous Searches */}
            <PreviousSearches
                searches={previousTerms}
                onLabelClicked={handleTermClicked}
            />

            { /* Gifs list */}
            <GifsList gifs={gifs} />
        </>
    )
}
