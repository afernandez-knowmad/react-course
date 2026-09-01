import { CustomHeader } from '../../shared/components/CustomHeader'
import { PreviousSearches } from '../../shared/components/PreviousSearches'
import { SearchBar } from '../../shared/components/SearchBar'
import { GifsList } from './GifsList'
import { useGifs } from '../hooks/useGifs'

export const GifsApp = () => {

    const { gifs, previousTerms, handleTermClicked, handleSearch } = useGifs();
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
