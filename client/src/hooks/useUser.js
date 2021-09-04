import { useEffect, useState } from 'react';
import UserStorage from '../service/storage/userStorage';
import validateUser from '../utils/validators';

const useUser = () => {
    const storage = UserStorage();

    const [user, setUser] = useState(null);

    useEffect(() => {
        getLoggedUser();
    }, []);

    const getLoggedUser = async () => {
        const loggedUser = await storage.getUser();
        if (loggedUser) {
            setUser(loggedUser);
        } else {
            console.log('user not found');
        }
    };

    const updateUser = (user) => {
        validateUser(user);
        setUser(user);
        storage.saveUser(user);
    };

    const removeUser = async () => {
        await storage.removeUser();
        setUser(null);
    };

    return [user, updateUser, removeUser];
};

export default useUser;