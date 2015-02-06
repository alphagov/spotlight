# Contribution guidelines

We welcome patches!

## Commit hygiene

Please see our [git style guide][gitstyle]
which describes how we prefer git history and commit messages to read.

[gitstyle]: https://github.com/alphagov/styleguides/blob/master/git.md

## JavaScript

We have a [JavaScript style guide][jsstyle]. The most important things to note are:

1. Use `.js-` prefixed classnames in HTML for JavaScript-only HTML classes
2. JavaScript filenames should be lowercase and use underscores rather than hyphens
3. URLs should contain hyphens rather than underscores

We lint our code as part of our build and test process (`npm run lint`).

[jsstyle]: https://github.com/alphagov/styleguides/blob/master/js.md

## JSON

Keys in JSON objects should be obvious. Don't worry about keeping them short to the
point that they're unreadable, compression will take care of that. They should be
lowercase words separated by hyphens.

Module-level JSON for Stagecraft is generated as part of the build process.

## Visual changes

For visual changes, it can be helpful to provide images in your pull-request
showing before and after to highlight the differences.
