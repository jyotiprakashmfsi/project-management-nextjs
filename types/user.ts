export interface UserData {
    fname: string;
    email: string;
    password: string;
}

export interface SafeUser {
    id: number;
    email: string;
    fname: string;
}

export interface UserUpdateData{
    id?: number;
    email?: string;
    fname?: string;
    contact?: string;
    dob?: string;
}