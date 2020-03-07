/* Written by Ye Liu */

import axios from 'axios';

const BASE_URL_ORG = 'https://api.travis-ci.org';
const BASE_URL_COM = 'https://api.travis-ci.com';
const HEADERS = { 'Accept': 'application/vnd.travis-ci.2.1+json' };
const SHIELDS_IO_URL = 'https://img.shields.io/badge/';


export default async (ctx, next) => {
    const tokens = ctx.request.url.split('/').slice(1);
    if (tokens.length != 5) {
        ctx.body = `ERROR: Unable to parse url: ${ctx.request.url}`;
        return;
    }

    const baseUrl = tokens[4] == 'org' ? BASE_URL_ORG : BASE_URL_COM;
    const repo = `${tokens[0]}/${tokens[1]}`;

    const branchUrl = `${baseUrl}/repos/${repo}/branches/${tokens[2]}`;
    const jobId = await axios.get(branchUrl, { headers: HEADERS }).then(res => {
        return res.data.branch.job_ids[tokens[3] - 1];
    }).catch(() => {
        ctx.body = `ERROR: Unable to fetch repo: ${repo}`;
    });

    if (!jobId) {
        return;
    }

    const jobUrl = `${baseUrl}/jobs/${jobId}`;
    ctx.build = await axios.get(jobUrl, { headers: HEADERS }).then(res => {
        return res.data.job.state;
    }).catch(() => {
        ctx.body = `ERROR: Unable to fetch job: ${jobId}`;
    });

    if (!ctx.build) {
        return;
    }

    switch (ctx.build) {
        case 'passed':
            var badgeUrl = `${SHIELDS_IO_URL}build-passing-brightgreen.svg`;
            break;
        case 'failed':
            var badgeUrl = `${SHIELDS_IO_URL}build-failure-red.svg`;
            break;
        default:
            var badgeUrl = `${SHIELDS_IO_URL}build-${ctx.build}-yellow.svg`;
    }

    const badge = await axios.get(badgeUrl);
    ctx.set({ 'content-type': 'image/svg+xml;charset=utf-8' });
    ctx.body = badge.data;

    // Return badge
    next();

    // Update database
    const res = await ctx.db.select('repo').from('repos').where('repo', repo);

    if (res.length > 0) {
        await ctx.db('repos').update({
            state: ctx.build,
            lastRequestIp: ctx.request.ip,
            lastRequestTime: new Date()
        }).where('repo', repo);
    } else {
        await ctx.db('repos').insert({
            repo: `${tokens[0]}/${tokens[1]}`,
            state: ctx.build,
            lastRequestIp: ctx.request.ip,
            lastRequestTime: new Date()
        });
    }
};
