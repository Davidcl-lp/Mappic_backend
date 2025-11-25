export interface User {
    id: number,
    name: string,
    email: string,
    password_hash: string,
    profile_picture_url: string,
    created_at: Date,
}