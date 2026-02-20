// Rate Limiting Middleware
const rateLimitMap = new Map < string, {count: number, lastReset: number} > ();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUEST_PER_WINDOW = 8;

export function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const userStats = rateLimitMap.get(ip);

    if (!userStats) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
        return false;
    }

    if (now - userStats.lastReset > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
        return false;
    }

    if (userStats.count >= MAX_REQUEST_PER_WINDOW) {
        return true; 
    }

    userStats.count += 1;
    return false;
}