export interface User {
    id?: string;
    email: string;
    role: string;
    exp?: number; 
    username: string;
    image?: File | Blob;
}