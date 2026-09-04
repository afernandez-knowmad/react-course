interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

interface TaskState {
    todos: Todo[];
    length: number;
    completed: number;
    pending: number
}

export type TaskAction =
    | { type: 'ADD_TODO', payload: string }
    | { type: 'DELETE_TODO', payload: number }
    | { type: 'TOGGLE_TODO', payload: number }

export const getTaskInitialState = (): TaskState => {
    return {
        todos: [],
        length: 0,
        completed: 0,
        pending: 0,
    }
}
export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
    switch (action.type) {
        case 'ADD_TODO': {

            const newTodo: Todo = {
                id: Date.now(),
                text: action.payload.trim(),
                completed: false,
            }

            // ! No se debe mutar el estado
            // state.todos.push(newTodo)
            return {
                ...state,
                todos: [...state.todos, newTodo],
                length: state.length + 1,
                pending: state.pending + 1,
            };
        }
        case 'DELETE_TODO': {
            const updatedTodos: Todo[] = state.todos.filter((todo) => todo.id !== action.payload);

            return {
                ...state,
                todos: updatedTodos,
                length: updatedTodos.length,
                completed: updatedTodos.filter(todo => todo.completed).length,
                pending: updatedTodos.filter(todo => !todo.completed).length,
            };
        }
        case 'TOGGLE_TODO': {
            const updatedTodos: Todo[] = state.todos.map((todo) => {

                if (todo.id === action.payload) {
                    return { ...todo, completed: !todo.completed }
                }

                return todo
            });
            return {
                ...state,
                todos: updatedTodos,
                length: updatedTodos.length,
                completed: updatedTodos.filter(todo => todo.completed).length,
                pending: updatedTodos.filter(todo => !todo.completed).length,
            };
        }
        default:
            return state;
    }
}
