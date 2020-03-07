/* Copyright (c) Ye Liu. All rights reserved. */

import redis from 'redis';

import CONF from '../config';

// Connect to database
if (CONF.enable_cache) {
    var cache = redis.createClient(CONF.redis_connection);
}

export default async (ctx, next) => {
    // Check if cache exists
    const badge = cache.get(ctx.token.repo, redis.print);

    if (badge) {
        ctx.set({ 'content-type': 'image/svg+xml;charset=utf-8' });
        ctx.body = badge;
        ctx.badge = { state: 'cache' }
        return;
    }

    // Call next middleware
    next();

    // Create cache
    if (ctx.cache) {
        cache.set(ctx.token.repo, ctx.cache, redis.print);
        cache.expire(ctx.token.repo, CONF.expire);
    }
};
