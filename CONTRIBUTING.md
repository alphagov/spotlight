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

Please use `npm run lint` to ensure you haven't introduced any additional lint. We're
trying to get rid of it.

[jsstyle]: https://github.com/alphagov/styleguides/blob/master/js.md

## JSON

Keys in JSON objects should be obvious. Don't worry about keeping them short to the
point that they're unreadable, compression will take care of that. They should be
lowercase words separated by hyphens.

If you're creating JSON stubs for Stagecraft, make use of the Stagecraft linter in
the `tools` directory to ensure your JSON is consistent.
