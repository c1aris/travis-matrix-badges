/* Copyright (c) Ye Liu. All rights reserved. */

import knex from 'knex';

import CONF from '../config';

// Connect to database
const db = new knex({
    client: 'mysql',
    connection: CONF.db_connection
});

export default async (ctx, next) => {
    // Return badge first
    next();

    // Update database
    const res = await db.select('repo').from('repos').where('repo', ctx.badge.info.repo);

    if (res.length > 0) {
        var badge = ctx.badge.info;
        var repo = badge.repo;
        delete badge.repo;
        await db('repos').update(badge).where('repo', repo);
    } else {
        await db('repos').insert(ctx.badge.info);
    }
};
