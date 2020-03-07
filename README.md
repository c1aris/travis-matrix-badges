# travis-matrix-badges

To enable job-related build states, you may just manually configure the travis badge with the following url:

```
https://catcatserver.xyz/badges/${username}/${repo-name}/branch/${branch-name}/${job_id}/${suffix}
```

Here, `job_id` is the index of the job in a build, e.g. `1` for the first job and `5` for the fifth job. `suffix` could be `org` or `com`, representing different travis editions `travis-ci.org` and `travis-ci.com`.

Instead, if you would like to setup the service on your own server, just clone the whole project using:

```
git clone https://github.com/c1aris/travis-matrix-badges.git
```

After configuring your listening port and database in `config.js`, run the following command:

```
npm install && npm start
```

Happy continuous integrations :)
