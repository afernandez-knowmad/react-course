import { useQuery } from "@tanstack/react-query";
import { getSummaryAction } from "../actions/get-summary.action";

export const useHeroSummary = () => {
    return useQuery({
        queryKey: ['summary-information'], // Los argumentos de la funcion deberian ser siempre queryKeys
        queryFn: () => getSummaryAction(),
        staleTime: 1000 * 60 * 5 // 5 minutos
    });
}
