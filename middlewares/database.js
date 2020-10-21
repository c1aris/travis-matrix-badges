/* Copyright (c) Ye Liu. All rights reserved. */

import knex from 'knex';

import CONF from '../config';

// Connect to database
if (CONF.enable_db) {
    var db = new knex({
        client: 'mysql',
        connection: CONF.db_connection
    });
}

export default async (ctx, next) => {
    // Return badge first
    next();

    // Update database
    const res = await db.select('repo').from('repo').where('repo', ctx.badge.repo);

    if (res.length > 0) {
        var badge = ctx.badge;
        var repo = badge.repo;
        delete badge.repo;
        await db('repo').update(badge).where('repo', repo);
    } else {
        await db('repo').insert(ctx.badge);
    }
};
