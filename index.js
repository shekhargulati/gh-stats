#!/usr/bin/env node

const program = require('commander');
const gh = require('./gh-stats')

program
    .version('0.1.0')
    .arguments('<user> [users...]')
    .option('-t, --token <token>', 'Github personal oauth token')
    .action(function (user, others) {
        const users = [user, ...others];
        gh.generateStats(users, program.token);

    }).parse(process.argv);