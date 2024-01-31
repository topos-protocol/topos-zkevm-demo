<div id="top" />
<br />
<div align="center">
  <img src="./.github/assets/topos_logo.png#gh-light-mode-only" alt="Logo" width="200">
  <img src="./.github/assets/topos_logo_dark.png#gh-dark-mode-only" alt="Logo" width="200">
  <br />
  <p align="center">
  <b>Topos zkEVM demo 🚀</b>
  </p>
  <br />
</div>

## Getting Started

Experience the power of the Topos zkEVM on your local environment with an all-in-one Command-Line Interface (CLI) to run your own demo scenario.

### Requirements

#### Hardware

- Memory: 16GB or more

#### Software

- [Docker](https://docs.docker.com/get-docker/_) version 17.06.0 or greater
- [Docker Compose](https://docs.docker.com/compose/install/) version 2.0.0 or greater
- [NodeJS](https://nodejs.dev/en/) version 16.0.0 or greater
- [Rust](https://www.rust-lang.org/tools/install) recent nightly (2024)
- Git

### Install / Run the CLI

Depending on your NodeJS environment and preferences, there are several ways to install Topos zkEVM Demo.

To install the topos zkevm demo globally, using `npm`, run the following command:

```bash
$ npm install -g @topos-protocol/topos-zkevm-demo
```

To install the topos zkevm demo globally, using `yarn`, run the following command:

```bash
$ yarn global add @topos-protocol/topos-zkevm-demo
```

Alternatively, you can install and run via `npx`:

```bash
$ npx @topos-protocol/topos-zkevm-demo
```

### Run the demo

Navigate to [WALKTHROUGH](/WALKTHROUGH.md) to run the demo scenario!

### Development

To build the project locally, run:

```bash
$ npm run build
```

Then, test the newly built CLI:

```bash
$ node dist/main <command>
```

### Discussion

For community help or discussion, you can join the Topos Discord server:

[https://discord.gg/zMCqqCbGMV](https://discord.gg/zMCqqCbGMV)

## License

Licensed under either of

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <http://opensource.org/licenses/MIT>)

at your option.
