# Frodo (Developer)


Frodo is a comprehensive software that supporting the Chia eco-system, including wallet, developer tool, command line, extension and so on.

It is forked from the Pawket app.

The app is forked and modified from the Pawket app by Sutu Labs of 17 February 2023. Alphabean, Inc. releases the app under the GNU General Public License, Version 3.0. Licensees may convey the work under the license. There is no warranty for this app. The Pawket app is copyright Sutu Labs. The modifications to such software code are copyright 2023 Alphabean, Inc. The license may be viewed with a web browser either in the LICENSE file of the frodowallet repository in the frodowallet Github account at https://www.github.com/frodowallet, or via http://www.frodowallet.com/legal/license.html.

## Development

```sh
yarn install
```

After yarn install, copy over the following 3 files from
https://github.com/frodowallet/nft-storage-patched

packages/client/src/lib.js
packages/client/src/platform.web.js
packages/client/src/token.js

to node_modules/nft.storage/src

(diffs https://github.com/frodowallet/nft-storage-patched/commit/9a69a2fcd35fe7e6657052707bf7be10263b39d5)

### Compiles and hot-reloads for development

```sh
yarn serve # for Pawket
yarn serve:mixch # for Mixch
yarn serve-ext # for Extension
cd server && yarn serve # for Wallet CLI
```

### Compiles and minifies for production
```sh
yarn build:pawket # for Pawket
yarn build:mixch # for Mixch
yarn build-ext # for Extension
yarn build:server # for Wallet CLI
```

### Tests
```sh
yarn test
```

## Contribution

Your contribution is welcome by opening new Issue/PR.

## License

GPL-3.0