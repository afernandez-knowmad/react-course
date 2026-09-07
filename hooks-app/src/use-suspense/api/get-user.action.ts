
export interface User {
    id: number;
    name: string,
    location: string,
    role: string,
}

export const getUserAction = async (id: number) => {

    console.log("🚀 Llamada:");
    await new Promise((res) => setTimeout(res, 2000));
    console.log("🚀 Resolvio:");

    return {
        id: id,
        name: 'Alex Fernandez',
        location: 'Aguadulce',
        role: 'Frontend dev'
    }
}