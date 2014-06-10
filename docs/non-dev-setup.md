# Setting up Spotlight

These steps will let you set up Spotlight locally so that you can play around with
dashboard configuration.

## Things to install

### Git

1. Open `Terminal.app` from your `Applications > Utilities` folder, or type `cmd + space` to search for it
2. See if you have Git. Type `git --version`
3. If you have no developer tools follow the prompt and click install
4. Let the process run. Type `git --version` again to make sure you have Git now
5. If that doesn't work, [install Git from the internet][git]

Helpful links:

- [Set up Git](https://help.github.com/articles/set-up-git#platform-mac)
- [Allow Git to access GitHub](https://help.github.com/articles/generating-ssh-keys)

### Node.js

1. [Install Node.js][node]

### Grunt

1. Once Node.js is installed, open a new Terminal and run `sudo npm install -g grunt-cli` (this will need your password)

## Running the Spotlight code

1. Run `git clone git@github.com:alphagov/spotlight.git` from a new Terminal
2. You now have the Spotlight code in your home directory
3. Run `cd spotlight` to go into the directory with the Spotlight code
4. Run `npm install` to install the application dependencies
5. Run `grunt` to start the application
6. Visit http://localhost:3057 in your web browser
7. When you're done, type `ctrl + c` in Terminal to stop Spotlight running

## Getting the latest changes to Spotlight

1. From inside the directory with the Spotlight code, run `git pull`

## Changing where you get data from

The data source is configured in a file in `config/config.development.json`.

You can change the location of the data source in that file. You'll need to restart
Spotlight before it takes effect.


[git]: http://git-scm.com/book/en/Getting-Started-Installing-Git
[node]: http://nodejs.org/
