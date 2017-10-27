const request = require('request-promise');
const Table = require('cli-table');
const process = require('process');

let github = {
    user: null,
    token: null,
    getUser: function (user) {
        const r = {
            "method": "GET",
            "uri": "https://api.github.com/users/" + github.user,
            "json": true,
            "headers": {
                "User-Agent": "gh-stats"
            }
        };
        if (github.token) {
            r.headers['Authorization'] = "Bearer " + github.token;
        }
        return request(r);
    },
    getUserReposUrl: function (user) {
        return user.repos_url;
    },
    isPublic: function (repo) {
        return !repo.private;
    },
    getUserRepos: function (uri, repos) {
        const r = {
            "method": "GET",
            "uri": uri,
            "json": true,
            "resolveWithFullResponse": true,
            "headers": {
                "User-Agent": "gh-stats"
            }
        };
        if (github.token) {
            r.headers['Authorization'] = "Bearer " + github.token;
        }
        return request(r).then(function (response) {
            if (!repos) {
                repos = [];
            }
            repos = repos.concat(response.body);
            process.stdout.write(".");

            if (response.headers.link.split(",").filter(function (link) { return link.match(/rel="next"/) }).length > 0) {
                const next = new RegExp(/<(.*)>/).exec(response.headers.link.split(",").filter(function (link) { return link.match(/rel="next"/) })[0])[1];
                return github.getUserRepos(next, repos);
            }
            return repos;
        });
    }
}

function getData(user, token) {
    github.token = token;
    github.user = user
    return github.getUser()
        .then(github.getUserReposUrl)
        .then(github.getUserRepos)
        .filter(github.isPublic)
        .then(function (allPublicRepos) {
            const publicRepoCount = allPublicRepos.length;
            let totalStars = 0;
            let totalForks = 0;
            allPublicRepos.forEach(function (r) {
                totalStars += r.stargazers_count
                totalForks += r.forks_count;
            });
            return [
                user,
                publicRepoCount,
                totalStars,
                totalForks
            ]
        });
}

async function generateStats(users, token) {
    try {
        const results = await Promise.all(users.map(user => getData(user, token)));
        const table = new Table({
            head: ['User', 'Total Repositories', 'Total Stars', 'Total Forks']
        });
        results.forEach(r => table.push(r));
        console.log();
        console.log(table.toString());
    } catch (e) {
        console.log(e);
    }
}

module.exports.generateStats = generateStats;