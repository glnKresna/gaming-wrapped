export class SteamApiError extends Error {
    public status: number;

    constructor(message: string, status: number = 400) {
        super(message);
        this.status = status;
        this.name = 'SteamApiError';
    }
}