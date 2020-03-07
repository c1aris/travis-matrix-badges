/* Copyright (c) Ye Liu. All rights reserved. */

export default async (ctx, next) => {
    // Parse tokens
    const tokens = ctx.request.url.split('/').slice(1);
    if (tokens.length != 5) {
        ctx.body = `ERROR: Unable to parse url: ${ctx.request.url}`;
        return;
    }

    // Pack tokens
    ctx.token = {
        repo: `${tokens[0]}/${tokens[1]}`,
        branch: tokens[2],
        job: tokens[3],
        suffix: tokens[4].split('?')[0]
    };

    // Call next middleware
    await next();
};
