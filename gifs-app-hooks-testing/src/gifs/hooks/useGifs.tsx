import { useRef, useState } from 'react'
import type { Gif } from '../interfaces/gif.interface';
import { getGifsByQuery } from '../actions/get-gifs-by-query.actions';

// const gifsCache: Record<string, Gif[]> = {}
// const gifsCache: Record<string, Gif[]> = {
//     'drangon ball': [],
//     'pokemon': [],
//     'naruto': [],
// }

export const useGifs = () => {
    const [gifs, setGifs] = useState<Gif[]>([]);
    const [previousTerms, setPreviousTerm] = useState<string[]>(['drangon ball', 'pokemon', 'naruto']);


    const gifsCache = useRef<Record<string, Gif[]>>({});


    const handleTermClicked = async (term: string) => {
        if (gifsCache.current[term]) {
            setGifs(gifsCache.current[term]);
            return;
        }

        term = term.trim().toLocaleLowerCase();
        if (term === '') return;

        setPreviousTerm([term, ...previousTerms.filter(t => t !== term)]);

        const foundGifs = await getGifsByQuery(term);
        setGifs(foundGifs);
        gifsCache.current[term] = foundGifs;

    };

    const handleSearch = async (search: string) => {
        search = search.trim().toLocaleLowerCase();
        if (search === '') return;

        if (previousTerms.includes(search)) return;

        setPreviousTerm([search, ...previousTerms.slice(0, 7)]);

        const foundGifs = await getGifsByQuery(search);
        setGifs(foundGifs);

        gifsCache.current[search] = foundGifs;
        // console.log("🚀 ~ handleSearch ~ gifsCache:", gifsCache.current);
    };

    return { gifs, previousTerms, handleTermClicked, handleSearch };
}
