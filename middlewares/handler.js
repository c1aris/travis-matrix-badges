/* Copyright (c) Ye Liu. All rights reserved. */

import axios from 'axios';

import CONF from '../config';

const BASE_URL_ORG = 'https://api.travis-ci.org';
const BASE_URL_COM = 'https://api.travis-ci.com';
const HEADERS = { 'Accept': 'application/vnd.travis-ci.2.1+json' };


export default async (ctx, next) => {
    const baseUrl = ctx.badge.branch.suffix == 'org' ? BASE_URL_ORG : BASE_URL_COM;

    // Fetch repo inoformation
    var url = `${baseUrl}/repos/${ctx.badge.repo}/branches/${ctx.badge.branch}`;
    var res = await axios.get(url, { headers: HEADERS }).catch(err => { return err; });
    if (res.status == 200) {
        var jobId = res.data.branch.job_ids[ctx.badge.job - 1];
    } else {
        ctx.body = `ERROR: Unable to fetch repo: ${ctx.badge.repo}`;
        return;
    }

    // Fetch job information
    url = `${baseUrl}/jobs/${jobId}`;
    res = await axios.get(url, { headers: HEADERS }).catch(err => { return err; });
    if (res.status == 200) {
        var state = res.data.job.state;
    } else {
        ctx.body = `ERROR: Unable to fetch job: ${jobId}`;
        return;
    }

    switch (state) {
        case 'passed':
            var badgeUrl = `${CONF.shieldsUrl}/build-passing-brightgreen.svg`;
            break;
        case 'failed':
            var badgeUrl = `${CONF.shieldsUrl}/build-failure-red.svg`;
            break;
        default:
            var badgeUrl = `${CONF.shieldsUrl}/build-${state}-yellow.svg`;
    }

    res = await axios.get(badgeUrl).catch(err => { return err; });
    if (res.status == 200) {
        ctx.set({ 'content-type': 'image/svg+xml;charset=utf-8' });
        ctx.body = res.data;
    } else {
        ctx.body = `ERROR: Unable to fetch Shields IO`;
        return;
    }

    ctx.badge.info = {
        repo: ctx.badge.repo,
        state: state,
        lastRequestIp: ctx.request.ip,
        lastRequestTime: new Date()
    };

    // Call next middleware
    await next();
};
