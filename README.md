# Louisiana Groups
Description needed here

## Table of Contents
* [Louisiana Groups](#louisiana-groups)
  * [Roadmap](#roadmap)
  * [Tech Used](#tech-used)
  * [Contributors](#contributors)
  * [Notes](#notes)
  * [Development](#development)
  * [License](#license)

## Roadmap
- [x] Upgrade to FontAwesome5 + brands
- [x] Add website and social links to cards
- [ ] Add React routing for pages
- [ ] Add "next meetup" to group cards
- [ ] Add isotope for toggle and search filtering (https://codepen.io/desandro/pen/wfaGu)

## Development

Before you get started hacking on this project, you’ll need [Node.js](https://nodejs.org/en/)
installed on your machine. You’ll also need a package manager; we like [Yarn](https://yarnpkg.com/en/)
but [NPM](https://github.com/npm/npm) also works fine—just follow your heart.

When you’re ready to rock, clone the project:

```sh
$ git clone https://github.com/LouisianaGroups/louisiana-groups.git
```

Next, you’ll need to install the project’s dependencies, which are defined in `package.json`.
Change to the project directory and kick off the install process (if you chose NPM, replace
`yarn` with `npm` henceforth):

```sh
$ yarn install
```

You’re all set! That was it! To run the project, just:

```sh
$ yarn start
```

If all went well, you should be able to access a development server at http://localhost:3000/.
Happy hacking!

## Tech Used
| Needed | Used |
| ------ | ------ |
| UI architecture | [React](https://github.com/facebook/react)
| CSS Grid System, etc. | [Bootstrap 4](http://getbootstrap.com)
| Font Icons | [Font Awesome 5](https://fontawesome.com) + [brands](https://fontawesome.com/icons?d=brands)
| Database | [Google Spreadsheets](https://google.com/sheets)
| Tracking | [Google Analytics](https://google.com/analytics)
| CRON triggers | [Dead Man's Snitch](https://deadmanssnitch.com/r/b2746d2af7)

## Contributors
- [Adam Culpepper](https://github.com/adamculpepper)
- [N. G. Scheurich](https://nick.scheurich.me)
- [James Alt](https://github.com/james-alt)

## Notes
- Since this is a personal project, I'm not screwing with browser compatibility. Use a real browser. :)

## Contributing
Want to contribute? Awesome! Contributions are always welcome—just be sure to
read and follow the [code of conduct](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md).

## License
This project is released under the [MIT license](https://github.com/LouisianaGroups/louisiana-groups/blob/master/LICENSE).
