#!/usr/bin/env node

const program = require('commander');
const gh = require('./gh-stats')

program
    .version('0.1.0')
    .arguments('<user>')
    .option('-t, --threshold <threshold>', 'list repos above this threshold', parseInt)
    .option('-l, --limit <limit>', 'limit to this many repos', parseInt)
    .action(function (user) {
        gh.generateStatsForUser(user, {
            threshold: program.threshold,
            limit: program.limit
        });
    }).parse(process.argv);