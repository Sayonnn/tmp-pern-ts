export interface User {
    twofa_secret: any;
    id?: string;
    email: string;
    role: string;
    username: string;
    image?: File | Blob;
    permissions?: [number] | [];
    super_admin?: boolean;
    is_verified?: boolean;
    twofa_enabled?: boolean;
    updated_at?: string | null;
    created_at?: string | null;
}