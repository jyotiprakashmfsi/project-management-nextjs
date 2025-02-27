import { useUser } from "../context/UserContext";
import Cookies from 'js-cookie';

export const header = () => {
    const { token } = useUser();
    return {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorisation: `Bearer ${token}`
    }
}

export const getHeaders = () => {
    const token = Cookies.get('token');
    return {
        'Content-Type': 'application/json',
        'Authorisation': `Bearer ${token}`
    };
};