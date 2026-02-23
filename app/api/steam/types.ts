export interface RawSteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    [key: string]: unknown; // Ignore random properties from Steam API
}

export interface RawSteamPlayer {
    personaname: string;
    avatarfull: string;
    timecreated: number;
    [key: string]: unknown;
}