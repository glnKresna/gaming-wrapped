export interface SteamGame {
    appid: number;
    name: string;
    playtime_forever: number; 
    img_icon_url: string;     
}

export interface WrappedApiResponse {
    games?: SteamGame[];
    error?: string;
}