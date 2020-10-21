/* Copyright (c) Ye Liu. All rights reserved. */

import axios from 'axios';

import CONF from '../config';

const BASE_URL = 'https://api.travis-ci.com';
const HEADERS = { 'Accept': 'application/vnd.travis-ci.2.1+json' };
const SHIELDS_IO_URL = 'https://img.shields.io/badge';


export default async (ctx, next) => {
    // Fetch repo info
    var url = `${BASE_URL}/repos/${ctx.token.repo}/branches/${ctx.token.branch}`;
    var res = await axios.get(url, { headers: HEADERS }).catch(err => { return err; });
    if (res.status == 200) {
        var jobId = res.data.branch.job_ids[ctx.token.job - 1];
    } else {
        ctx.body = `ERROR: Unable to fetch repo: ${ctx.token.repo}`;
        return;
    }

    // Fetch job info
    url = `${BASE_URL}/jobs/${jobId}`;
    res = await axios.get(url, { headers: HEADERS }).catch(err => { return err; });
    if (res.status == 200) {
        var state = res.data.job.state;
    } else {
        ctx.body = `ERROR: Unable to fetch job: ${jobId}`;
        return;
    }

    // Construct badge url
    switch (state) {
        case 'passed':
            var badgeUrl = `${SHIELDS_IO_URL}/build-passing-brightgreen.svg`;
            break;
        case 'failed':
            var badgeUrl = `${SHIELDS_IO_URL}/build-failure-red.svg`;
            break;
        default:
            var badgeUrl = `${SHIELDS_IO_URL}/build-${state}-yellow.svg`;
    }

    // Fetch badge
    res = await axios.get(badgeUrl).catch(err => { return err; });
    if (res.status == 200) {
        ctx.set({ 'content-type': 'image/svg+xml;charset=utf-8' });
        ctx.body = res.data;
        ctx.cache = res.data;
    } else {
        ctx.body = `ERROR: Unable to fetch Shields IO`;
        return;
    }

    // Pack badge info
    ctx.badge = {
        repo: ctx.token.repo,
        state: state,
        lastRequestIp: ctx.request.ip,
        lastRequestTime: new Date()
    };

    // Call next middleware
    if (CONF.enable_db) {
        await next();
    }
};
