/* Copyright (c) Ye Liu. All rights reserved. */

export default {
    // Server listening port
    port: '5656',

    // Server listening IP
    ip: '0.0.0.0',

    // Shields IO URL
    shieldsUrl: 'https://img.shields.io/badge',

    // Redis
    enable_cache: false,
    redis_connection: {
        host: 'localhost',
        port: 6379,
        options: {
            password: '',
            timeout: 3000
        }
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
