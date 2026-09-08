import type { User } from "@/use-suspense/api/get-user.action";
import { createContext, useEffect, useState, type PropsWithChildren } from "react"
import { users } from "../data/user-mock.data";

// interface UserContextProps {
//     children: React.ReactNode
// }

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

interface UserContextProps {
    authStatus: AuthStatus;
    user: User | null
    isAuthenticated: boolean,
    login: (userId: number) => boolean;
    logout: () => void;
}

export const UserContext = createContext({} as UserContextProps);


export const UserContextProvider = ({ children }: PropsWithChildren) => {
    const [authStatus, setAuthStatus] = useState<AuthStatus>('checking');
    const [user, setUser] = useState<User | null>(null);

    const handleLogin = (userId: number): boolean => {
        const user = users.find(user => user.id === userId);
        console.log('handleLogin user', userId, user);
        if (!user) {
            console.log('User not found', userId);
            handleLogout();
            return false;
        }

        setUser(user);
        setAuthStatus('authenticated');
        localStorage.setItem('userId', userId.toString());
        return true;
    }

    const handleLogout = (): void => {
        console.log('Logout');
        setUser(null);
        setAuthStatus('not-authenticated');
        localStorage.removeItem('userId');
    }

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        console.log("🚀 ~ storedUserId:", storedUserId);
        if (storedUserId) {
            console.log("🚀 ~ handleLogin ~ storedUserId:", storedUserId);
            handleLogin(Number(storedUserId));
        } else {
            handleLogout();
        }
    }, []);

    return <UserContext value={{
        authStatus: authStatus,
        isAuthenticated: authStatus === 'authenticated',
        user: user,
        login: handleLogin,
        logout: handleLogout,
    }}> {children} </UserContext >
}
