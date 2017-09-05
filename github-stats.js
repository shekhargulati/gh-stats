var https = require('https'),
    user = process.argv[2],
    opts = parseOpts(process.argv.slice(3))

request('/users/' + user, function (res) {
    if (!res.public_repos) {
        console.log(res.message)
        return
    }
    var pages = Math.ceil(res.public_repos / 100),
        i = pages,
        repos = []
    while (i--) {
        request('/users/' + user + '/repos?per_page=100&page=' + (i + 1), check)
    }
    function check(res) {
        repos = repos.concat(res)
        pages--
        if (!pages) output(repos)
    }
})

function request(url, cb) {
    https.request({
        hostname: 'api.github.com',
        path: url,
        headers: { 'User-Agent': 'GitHub Stats' }
    }, function (res) {
        var body = ''
        res
            .on('data', function (buf) {
                process.stdout.write(".");
                body += buf.toString()
            })
            .on('end', function () {
                cb(JSON.parse(body))
            })
    }).end()
}

function output(repos) {
    var totalStars = 0,
        longest = 0,
        totalForks = 0,
        list = repos
            .filter(function (r) {
                totalStars += r.stargazers_count
                totalForks += r.forks_count;
                if (r.stargazers_count >= opts.thresh) {
                    if (r.name.length > longest) {
                        longest = r.name.length
                    }
                    return true;
                }
            })
            .sort(function (a, b) {
                return b.stargazers_count - a.stargazers_count
            })

    if (list.length > opts.limit) {
        list = list.slice(0, opts.limit)
    }

    console.log('\n' + user + ' has ' + repos.length + ' public repositories as of ' + new Date().toLocaleString())
    console.log('Total Stars: ' + totalStars)
    console.log('Total Forks: ' + totalForks + '\n')
    console.log(list.map(function (r) {
        return r.name +
            new Array(longest - r.name.length + 4).join(' ') +
            r.stargazers_count
            + ' stars '
            + r.forks_count
            + ' forks '
    }).join('\n'))

}

function parseOpts(args) {
    var opts = {
        thresh: 1,
        limit: Infinity
    }
    args.forEach(function (a, i) {
        var next = args[i + 1]
        if (a === '-t') {
            opts.thresh = parseInt(next, 10) || 1
        } else if (a === '-l') {
            opts.limit = parseInt(next, 10) || Infinity
        }
    })
    return opts
}