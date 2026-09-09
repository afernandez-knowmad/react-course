import { heroApi } from "../api/hero.api"
import type { HeroresResponse } from "../types/get-heroes.response";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getHeroesByPageAction = async (page: number, limit = 6, category = 'all'): Promise<HeroresResponse> => {
    if (isNaN(page)) {
        page = 1;
    }
    if (isNaN(limit)) {
        limit = 1;
    }

    const { data } = await heroApi.get<HeroresResponse>('/', {
        params: {
            limit,
            page,
            offset: (page - 1) * limit,
            category
        }
    });
    // console.log("🚀 ~ getHeroesByPageAction ~ data:", data)

    const heroes = data.heroes.map(hero => ({
        ...hero,
        image: `${BASE_URL}/images/${hero.image}`
    }));

    return {
        ...data,
        heroes
    };
}