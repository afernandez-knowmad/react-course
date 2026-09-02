import { describe, expect, test } from 'vitest';
import { giphyApi } from './giphy.api';


describe('giphyApi', () => {
    test('should be configured with the correct base URL', () => {
        expect(giphyApi.defaults.baseURL).toBe('https://api.giphy.com/v1/gifs');
    });

    test('should include the correct default parameters', () => {
        expect(giphyApi.defaults.params).toEqual({
            api_key: import.meta.env.VITE_GIPHY_API_KEY,
            limit: 10,
            offset: 0,
            rating: 'G',
            lang: 'es'
        });
    });
});