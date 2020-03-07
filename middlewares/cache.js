/* Copyright (c) Ye Liu. All rights reserved. */

import redis from 'redis';

import CONF from '../config';

// Connect to database
if (CONF.enable_cache) {
    var cache = redis.createClient(CONF.redis_connection);
}

export default async (ctx, next) => {
    // Construct cache key
    const key = `${ctx.token.repo}/${ctx.token.branch}/${ctx.token.job}`;

    if (!ctx.query.no_cache) {
        // Check if cache exists
        const badge = await new Promise((resolve) => {
            cache.get(key, (_, res) => {
                return resolve(res);
            });
        });

        // Use cache if cache exists
        if (badge) {
            ctx.set({ 'content-type': 'image/svg+xml;charset=utf-8' });
            ctx.body = badge;
            ctx.badge = { state: 'cache' }
            return;
        }
    }

    // Call next middleware
    await next();

    // Create cache
    if (ctx.cache) {
        cache.set(key, ctx.cache);
        cache.expire(key, CONF.expire);
    }
};
