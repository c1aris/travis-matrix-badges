/* Copyright (c) Ye Liu. All rights reserved. */

import dateFormat from 'dateformat';

export default async (ctx, next) => {
    try {
        // Save request time
        const qt = dateFormat(new Date(), 'yyyy-mm-dd hh:MM:ss');
        const start = Date.now();

        // Call next middleware
        await next();

        // Calculate response time
        const rt = Date.now() - start;
        ctx.set('X-Response-Time', `${rt}ms`);

        // Log response time
        var state = ctx.badge && ctx.badge.info ? ctx.badge.info.state : undefined;
        console.log(`${qt} ${ctx.request.ip} ${ctx.method} ${ctx.url} - ${state || 'error'} - ${rt}ms`);
    } catch (err) {
        // Log error
        console.error(`Catch Error: ${err && err.message ? err.message : err.toString()}`);

        // Throw error
        ctx.throw(418);
    }
};
