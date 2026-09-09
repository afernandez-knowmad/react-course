import { heroApi } from "../api/hero.api"
import type { HeroresResponse } from "../types/get-heroes.response";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getHeroesByPageAction = async (): Promise<HeroresResponse> => {
    const { data } = await heroApi.get<HeroresResponse>('/');
    console.log("🚀 ~ getHeroesByPageAction ~ data:", data)

    const heroes = data.heroes.map(hero => ({
        ...hero,
        image: `${BASE_URL}/images/${hero.image}`
    }));

    return {
        ...data,
        heroes
    };
}