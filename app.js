/* Copyright (c) Ye Liu. All rights reserved. */

import Koa from 'koa';
import knex from 'knex';

import middlewares from './middlewares';
import CONF from './config';

// Init Koa app
const app = new Koa({ proxy: true });

// Bind database to context
app.context.db = new knex({
    client: 'mysql',
    connection: CONF.mysql_connection
});

// Bind middlewares
app
    .use(middlewares.logger)
    .use(middlewares.parser)
    .use(middlewares.cache)
    .use(middlewares.handler)
    .use(middlewares.database);

// Start web service
app.listen(CONF.port, CONF.ip, () => console.log(`Listening on port ${CONF.port}...`));
