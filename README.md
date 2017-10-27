# Github Stats Utility

This node command-line utility can be used to count total number of stars and forks for a user. You can also use it to compare your stats with other Github users or organization.

Before you can use it, you have to install it.

```
$ npm install -g gh-stats
```

You can then run the following command to compare yourself with other Git users or organization.

```
$  gh-stats shekhargulati google facebook
...................................................
┌───────────────┬────────────────────┬─────────────┬─────────────┐
│ User          │ Total Repositories │ Total Stars │ Total Forks │
├───────────────┼────────────────────┼─────────────┼─────────────┤
│ shekhargulati │ 235                │ 13341       │ 2586        │
├───────────────┼────────────────────┼─────────────┼─────────────┤
│ google        │ 1087               │ 609359      │ 116984      │
├───────────────┼────────────────────┼─────────────┼─────────────┤
│ facebook      │ 173                │ 552892      │ 90634       │
```

The CLI also supports Github personal access tokens in case you face Github API limit issue.

```
$ gh-stats shekhargulati -t <token>
```