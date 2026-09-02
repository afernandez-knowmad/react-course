import { describe, expect, test, vi } from 'vitest';
import { getGifsByQuery } from './get-gifs-by-query.actions';
import { giphyApi } from '../api/giphy.api';
import AxiosMockAdapter from 'axios-mock-adapter';
import { beforeEach } from 'node:test';
import { giphyMockedResponseData } from '../../mocks/giphy.response.data';


describe('getGifsByQuery', () => {

    let mock = new AxiosMockAdapter(giphyApi);

    beforeEach(() => {
        mock = new AxiosMockAdapter(giphyApi);
    });

    // test('should fetch gifs by query', async () => {
    //     const gifs = await getGifsByQuery('cats');
    //     expect(gifs).toBeInstanceOf(Array);
    //     expect(gifs).toEqual(mockGifs);
    // });

    // test('should return a list of gifs', async () => {
    //     const gifs = await getGifsByQuery('cats');
    //     const [gif1] = gifs;

    //     expect(gif1).toStrictEqual({
    //         id: expect.any(String),
    //         title: expect.any(String),
    //         url: expect.any(String),
    //         width: expect.any(Number),
    //         height: expect.any(Number),
    //     });
    // });

    test('should return a list of gifs', async () => {
        mock.onGet('/search').reply(200, {
            data: giphyMockedResponseData.data
        });

        const gifs = await getGifsByQuery('cats');

        expect(gifs.length).toBe(10);
        gifs.forEach((gif) => {
            expect(gif).toStrictEqual({
                id: expect.any(String),
                title: expect.any(String),
                url: expect.any(String),
                width: expect.any(Number),
                height: expect.any(Number),
            });
        });
    });

    test('should return an empty list if query is empty', async () => {
        // mock.onGet('/search').reply(200, {
        //     data: []
        // });

        // mock.restore(); // Restore the original behavior of the giphyApi instance

        const gifs = await getGifsByQuery('');

        expect(gifs.length).toBe(0);

    });

    test('should handle error when API return an error', async () => {
        // const consoleErrorSpy = vi.spyOn(console, 'error');
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { }); // Ejecuta el codigo de mockimplementation para evitar que se muestre el error en la consola durante la prueba

        mock.onGet('/search').reply(400, {
            data: {
                message: 'Bad Request'
            }
        });

        const gifs = await getGifsByQuery('Goku');
        console.log("🚀 ~ gifs:", gifs)

        expect(gifs.length).toBe(0);
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        // expect(consoleErrorSpy).toHaveBeenCalledWith(expect.anything());
    });
});