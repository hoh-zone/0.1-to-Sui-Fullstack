import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserInfo {
    name: string;
    age: string;
    personality: string;
    education: string;
    appearance: string;
    familyBackground: string;
    wealth: string;
    avatar: File | null;
}

interface UserContextType {
    userInfo: UserInfo;
    setUserInfo: (info: UserInfo) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: '',
        age: '',
        personality: '',
        education: '',
        appearance: '',
        familyBackground: '',
        wealth: '',
        avatar: null,
    });

    // 从本地存储加载用户信息
    useEffect(() => {
        const savedUserInfo = localStorage.getItem('userInfo');
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo));
        }
    }, []);

    // 保存用户信息到本地存储
    useEffect(() => {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }, [userInfo]);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};