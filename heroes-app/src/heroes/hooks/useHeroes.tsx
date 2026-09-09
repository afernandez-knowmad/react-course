import { useQuery } from "@tanstack/react-query";
import { getHeroesByPageAction } from "../actions/get-herores-by-page.actions";

export const useHeroes = (page: number, limit: number, category = 'all') => {
    return useQuery({
        queryKey: ['heroes', { page, limit, category }], // Los argumentos de la funcion deberian ser siempre queryKeys
        queryFn: () => getHeroesByPageAction(+page, +limit, category),
        staleTime: 1000 * 60 * 5 // 5 minutos
    });
}
