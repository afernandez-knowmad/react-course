
export interface ScrambleWordsState {
    currentWord: string;
    errorCounter: number;
    guess: string;
    isGameOver: boolean;
    maxAllowErrors: number;
    maxSkips: number;
    points: number;
    scrambledWord: string;
    skipCounter: number;
    words: string[];
    totalWords: number;
}

export type ScrambleWordsActions =
    | { type: 'SET_GUESS', payload: string }
    | { type: 'CHECK_ANSWER' }
    | { type: 'SKIP_WORD' }
    | { type: 'PLAY_AGAIN', payload: ScrambleWordsState }


const GAME_WORDS = [
    'REACT',
    'JAVASCRIPT',
    'TYPESCRIPT',
    'HTML',
    'ANGULAR',
    'SOLID',
    'NODE',
    'VUEJS',
    'SVELTE',
    'EXPRESS',
    'MONGODB',
    'POSTGRES',
    'DOCKER',
    'KUBERNETES',
    'WEBPACK',
    'VITE',
    'TAILWIND',
];

// Esta función mezcla el arreglo para que siempre sea aleatorio
const shuffleArray = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
};

// Esta función mezcla las letras de la palabra
const scrambleWord = (word: string = '') => {
    return word
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
};


export const getInitialScrambleWordsState = (): ScrambleWordsState => {
    const shuffleWords = shuffleArray([...GAME_WORDS]);

    return {
        currentWord: shuffleWords[0],
        errorCounter: 0,
        guess: '',
        isGameOver: false,
        maxAllowErrors: 3,
        maxSkips: 3,
        points: 0,
        scrambledWord: scrambleWord(shuffleWords[0]),
        skipCounter: 0,
        words: shuffleWords,
        totalWords: shuffleWords.length
    }
}

export const scrambleWordsReducer = (state: ScrambleWordsState, action: ScrambleWordsActions): ScrambleWordsState => {

    switch (action.type) {
        case 'SET_GUESS': {

            return {
                ...state,
                guess: action.payload?.trim().toUpperCase()
            }
        }
        case 'SKIP_WORD': {

            if (state.skipCounter >= state.maxSkips) {
                return state
            }

            const updatedWords = state.words.slice(1);

            return {
                ...state,
                guess: '',
                skipCounter: state.skipCounter + 1,
                words: updatedWords,
                currentWord: updatedWords[0],
                scrambledWord: scrambleWord(updatedWords[0])
            }
        }
        case 'CHECK_ANSWER': {
            if (state.currentWord === state.guess) {
                const newWords = state.words.slice(1);

                return {
                    ...state,
                    guess: '',
                    words: newWords,
                    points: state.points + 1,
                    currentWord: newWords[0],
                    scrambledWord: scrambleWord(newWords[0])
                }
            }
            return {
                ...state,
                errorCounter: state.errorCounter + 1,
                isGameOver: state.errorCounter + 1 >= state.maxAllowErrors
            };

        }
        case 'PLAY_AGAIN':
            return action.payload;

        default:
            return state;
    }

}
