import { describe, expect, test } from 'vitest';
import { getGifsByQuery } from './get-gifs-by-query.actions';
import { mockGifs } from '../../mocks/gifs.mock';


describe('getGifsByQuery', () => {
    test('should fetch gifs by query', async () => {
        const gifs = await getGifsByQuery('cats');
        expect(gifs).toBeInstanceOf(Array);
        expect(gifs).toEqual(mockGifs);
    });

    test('should return a list of gifs', async () => {
        const gifs = await getGifsByQuery('cats');
        const [gif1] = gifs;
        
        expect(gif1).toStrictEqual({
            id: expect.any(String),
            title: expect.any(String),
            url: expect.any(String),
            width: expect.any(Number),
            height: expect.any(Number),
        });
    });

});