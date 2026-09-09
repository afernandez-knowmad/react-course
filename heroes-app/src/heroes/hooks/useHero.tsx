import { useQuery } from "@tanstack/react-query";
import { getHeroAction } from "../actions/get-hero.action";

export const useHero = (idSlug: string) => {
    return useQuery({
        queryKey: ['hero', { idSlug }], // Los argumentos de la funcion deberian ser siempre queryKeys
        queryFn: () => getHeroAction(idSlug),
        retry: false
    });
}
