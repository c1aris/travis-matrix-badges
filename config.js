/* Copyright (c) Ye Liu. All rights reserved. */

export default {
    // Server listening port
    port: '5656',

    // Server listening IP
    ip: '0.0.0.0',

    // Redis
    enable_cache: false,
    redis_connection: {
        host: 'localhost',
        port: 6379
    },
    expire: 1800,

    // MySQL
    enable_db: false,
    db_connection: {
        host: 'localhost',
        user: '',
        password: '',
        database: ''
    }
};
