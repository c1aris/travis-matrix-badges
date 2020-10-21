# travis-matrix-badges

A light-weight web server based on Koa2 to produce badges of the build states in a travis matrix build.

### Quick Start

To enable job-related build states, you may configure the travis badge with the following url:

```
https://api.catcatserver.xyz/badge/${username}/${repo}/${branch}/${job}[?no_cache=true]
```

Here, `job` is the index of the job in a build, i.e. `1` for the first job and `5` for the fifth job.

Note that the badges are cached for 1800 seconds by default, you may force update the cache by adding `?no_cache=true` at the end of the url.

### Hosting your own server

If you would like to setup the service on your own server, clone the whole project using:

```
git clone https://github.com/yeliudev/travis-matrix-badges.git
```

After completing configurations in `config.js`, run the following command:

```
npm install && npm start
```

Happy continuous integrations :)
