export interface Album {
    id: number,
    title: string,
    description?: string,
    owner_id: number,
    created_at: Date,
    updated_at: Date,
    location_name: string,
    latitude?: string,
    longitude?: string,
    is_global: boolean,
}