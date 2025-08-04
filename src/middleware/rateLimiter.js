import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        
        
        /* 
        if we want to apply rate limit for specific user we just need to add user id in the limit function which will make each user rate limited
        const { success } = await ratelimit.limit(`user-${userId}`); 
        */

        // rate limited for all user 
        const { success } = await ratelimit.limit("my-rate-limit");

        if (!success) {
            return res.status(429).json({
                message: "Too many requests, please try again later.",
            });
        }

        next();
    } catch (error) {
        console.log("Rate limit error", error);
        next(error);
    }
}

export default rateLimiter;