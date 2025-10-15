type RateLimitEntry = {
    count: number;
    expires: number;
};

export interface RateLimiterOptions {
    limit: number;     
    windowMs: number;   
}

export class RateLimiter {
    private store: Map<string, RateLimitEntry>;
    private limit: number;
    private windowMs: number;

    constructor(options: RateLimiterOptions) {
        this.store = new Map();
        this.limit = options.limit;
        this.windowMs = options.windowMs;
    }


    public check(key: string): boolean {
        const now = Date.now();
        const entry = this.store.get(key);

        if (!entry) {
            this.store.set(key, { count: 1, expires: now + this.windowMs });
            return true;
        }
        
        if (entry.expires > now) {
            if (entry.count >= this.limit) {
                return false; // limit exceeded
            } else {
                entry.count += 1;
                return true;
            }
        } else {
            // window expired, reset counter
            this.store.set(key, { count: 1, expires: now + this.windowMs });
            return true;
        }
    } 
}


