import { heroApi } from "../api/hero.api";
import type { Hero } from "../types/hero.interface";

interface Option {
    name?: string;
    team?: string;
    category?: string;
    universe?: string;
    status?: string;
    strength?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const searchHeroesAction = async (options: Option) => {
    const {
        name,
        team,
        category,
        universe,
        status,
        strength } = options;

    if (!name && !team && !category && !universe && !status && !strength) return [];

    const { data } = await heroApi.get<Hero[]>('/search', {
        params: {
            name,
            team,
            category,
            universe,
            status,
            strength
        }
    });
    // console.log("🚀 ~ getHeroesByPageAction ~ data:", data)

    const heroes = data.map(hero => ({
        ...hero,
        image: `${BASE_URL}/images/${hero.image}`
    }));

    return heroes;
}