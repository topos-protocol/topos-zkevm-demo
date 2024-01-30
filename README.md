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

Now that you have installed the CLI, let's go over the demo scenario you are about to run!

#### 1. Install dependencies

First, let's verify that your local environment is suitable for running Topos zkEVM Demo, and install its internal projects:

```bash
$ topos-zkevm-demo install
```

Topos zkEVM Demo is built on top of two internal projects:

- [local-zkevm](https://github.com/topos-protocol/local-zkevm): a setup to run an Erigon chain along with a hardhat sample project to deploy a demo contract and send transactions
- [zero-bin](https://github.com/topos-protocol/zero-bin): the zk prover/verifier

_Note 1: You only need to run this command once._
_Note 2: Topos zkEVM Demo follows the [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html). Run `$ topos-zkevm-demo --help` to find the demo root directory, which we will later refer to as `DEMO_ROOT`._

#### 2. Start the Erigon chain

Start the Erigon chain to get ready to interact with it:

```bash
$ topos-zkevm-demo start
```

#### 3. Execute the demo script

You will find the hardhat sample project in `DEMO_ROOT/topos-zkevm-demo/local-zkevm/sample-hardhat-project` (reminder: find your `DEMO_ROOT` by executing `$ topos-zkevm-demo --help`). As detailed above, the project contains a demo contract, and a demo script that deploys the contract and sends transactions to the Erigon chain.

Optionally, you can replace the contract and the script with your own.

When you are ready to execute the demo script, run:

```bash
$ topos-zkevm-demo execute
```

The command will output whatever is logged in the demo script, which by default is the address of the deployed contract, the hashes of the two transactions that were sent, as well as the block that included them (by default, the script will have the two transactions included in the same block).

For example:

```bash
$ topos-zkevm-demo execute
> demo
> hardhat run scripts/demo.ts


Contract deployed at: 0x512d5c545fa66BaaA187020381876e1E368b5A08

Deployment transaction: 0x602540bfd101d1b02b160fe1fd84cfdb8b0fa35687fc5adc56592b931174c204

Ketchup transaction: 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130 (inserted in block 4)

Mustard transaction: 0x5d98aba30400f5f0cc9c0f2d34f9f4280ec1fca88b177b3c2251ad1ea31a9af3 (inserted in block 4)
```

From now on, the rest of the demo scenario will be divided into two roles that you will assume: the `prover`, and the `verifier`.

#### 4. [Prover] Generate a merkle proof

As a prover, your intention is the following: from the two transactions that are now part of your chain, you want to prove to a `verifier` that one of them is valid, without sharing any details about the other one (about any other transaction of the block).

For that matter, you will generate and send two proofs to the `verifier`:

- a **merkle proof**: an inclusion proof of your transaction's receipt in the transaction's block's receipt trie
- a **zk-proof**: a zero-knowledge (zk) validity proof that ensures that the state transition of the block is computationally valid

By verifying the _merkle proof_, the `verifier` can verify that your transaction is part of a greater set of transactions (a set that remains unknown to the `verifier`), and by verifying the `zk-proof`, the `verifier` can ensure that this greater set of transactions is computationally valid. Altogether, the verifier will verify that your transaction is part of a valid block, hence is a valid transaction.

Let's start by generating the merkle proof for your transaction:

```bash
$ topos-zkevm-demo generate merkle-proof <tx_hash>
```

For example:

```bash
$ topos-zkevm-demo generate merkle-proof 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130
node dist/main generate merkle-proof 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130

> generate-receipt-merkle-proof
> hardhat generate-receipt-merkle-proof 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130


✅ Successfully generated merkle proof for transaction 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130:

0xf851a02d247ca1770e3221e8aecf9d04fc9b6f7ff07361715c71ef8703bf24c7905d4580808080808080a0cfa9df4025f175e0c4338efc950dc2e30214a08e8ba6940226a97fd977b156b08080808080808080,0xf9011130b9010d02f90109018301155cb9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0
```

The command outputs the merkle proof as a comma-separated list of hex strings.

_Note: When copying the merkle proof, make sure to copy the whole list_.

#### 5. [Prover] Generate a zk-proof

From the number of the block which includes your two transactions (reminder: the block number is output by the [execute](#3-execute-the-demo-script) command), you can generate a zk-proof of the block:

```bash
$ topos-zkevm-demo generate zk-proof <block_number>
```

For example:

```bash
$ topos-zkevm-demo generate zk-proof 4
Proving block 4...

Successfully generated proof for block 4! (proof available at /Users/sebastiendan/.local/share/topos-zkevm-demo/zero-bin/proofs/b00004.zkproof)!
```

The command outputs the local path to the zk-proof file (`.zkproof` extension).

#### 6. [Verifier] Verify the merkle proof

You have switched role and are now a `verifier` who has been handed over a few pieces of data (a transaction hash, a merkle proof, and a zk-proof), and your intention is to verify that the given transaction is a valid one.

You will start by verifying the provided merkle proof.

For that matter, you will execute the following command:

```bash
$ topos-zkevm-demo verify merkle-proof <tx_hash> <merkle_roof> <receipt_trie_root>
```

As you may have noticed, the `verify merkle-proof` commands expect a `receipt_trie_root` that we haven't discussed about. Let's explain its role: a merkle proof consists in a merkle path that leads to the tree root, i.e., it is a list of tree nodes (hashes) that, combined, output a hash that equals the tree root, proving that the leaf (the first node of the path) is indeed in the tree. To verify a merkle proof, you therefore need three pieces of information: a leaf, a proof, and the tree root.

_Note: The `verify merkle-proof` command internally computes the right leaf for you, from the `tx_hash` that you pass._

So, first thing first, you need to retrieve the receipt trie root:

```bash
$ topos-zkevm-demo util get-receipt-trie-root <tx_hash>
```

For example:

```bash
$ topos-zkevm-demo util get-receipt-trie-root 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130
> get-receipt-trie-root
> hardhat get-receipt-trie-root 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130

0x11ef2192f0c9aa092d69b9acf82085f384f172188cc321da94566dc9d33a3b18
```

_Note: Internally, the `util get-receipt-trie-root` command fetches the block which includes the passed transaction hash, and outputs the receipt trie root from its header._

Now, you can verify the merkle proof.

For example:

```bash
$ topos-zkevm-demo verify merkle-proof 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130 0xf851a02d247ca1770e3221e8aecf9d04fc9b6f7ff07361715c71ef8703bf24c7905d4580808080808080a0cfa9df4025f175e0c4338efc950dc2e30214a08e8ba6940226a97fd977b156b08080808080808080,0xf9011130b9010d02f90109018301155cb9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0 0x11ef2192f0c9aa092d69b9acf82085f384f172188cc321da94566dc9d33a3b18
Verifying merkle-proof for transaction: 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130


> verify-receipt-merkle-proof
> hardhat verify-receipt-merkle-proof 0x785102ca9881b284588452cd90685d2c713cf61f6e4f3fcc8451bb6f2a571130 0xf851a02d247ca1770e3221e8aecf9d04fc9b6f7ff07361715c71ef8703bf24c7905d4580808080808080a0cfa9df4025f175e0c4338efc950dc2e30214a08e8ba6940226a97fd977b156b08080808080808080,0xf9011130b9010d02f90109018301155cb9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c0 0x11ef2192f0c9aa092d69b9acf82085f384f172188cc321da94566dc9d33a3b18


✅ Merkle proof has been verified
```

#### 7. [Verifier] Verify the zk-proof

Now that you have verified that the provided transaction is indeed part of a state transition (a block), you can verify that it is valid by verifying the block's zk-proof:

```bash
$ topos-zkevm-demo verify zk-proof <path_to_zk_proof>
```

For example:

```bash
$ topos-zkevm-demo verify zk-proof /Users/sebastiendan/.local/share/topos-zkevm-demo/zero-bin/proofs/b00004.zkproof
Verifying zk-proof: /Users/sebastiendan/.local/share/topos-zkevm-demo/zero-bin/proofs/b00004.zkproof

✅ /Users/sebastiendan/.local/share/topos-zkevm-demo/zero-bin/proofs/b00004.zkproof has been verified
```

Congratulations, you have now verified that the provided transaction is valid, with zero knowledge of the other transactions of the block!

### Conclusion

#### A few details

- `zero-bin` parameters have been tailored to function with most of the transactions that are commonly executed on a chain. If you have used your own contract and script in the hardhat sample project, and have faced technical issues with the zk-proof generation, reach out to us on our [Discord](https://discord.gg/zMCqqCbGMV)!
- You may have noticed that, as a `verifier`, you still had to interact with the Erigon chain to retrieve the receipt trie root. This means that you have full access to the chain, which is contradictory with the zero-knowledge aspect of verifying the block zk-proof. This is a shortcoming of Topos zkEVM Demo, and is where, in a real world scenario, the Topos zkEcosystem comes into play, by distributing verified subnet certificates that contain state transitions' zk-proofs and receipt trie roots to any verifiers. Read more about Topos [here](https://docs.topos.technology/content/module-1/4-protocol.html#transmission-control-engine-tce-)!

#### A few extra commands

Topos zkEVM Demo comes with a few extra commands that we haven't detailed yet:

- `topos-zkevm-demo stop [-p]`: Stop the Erigon chain, optionally purge the chain with the `-p` flag. You can then run `start` and `execute` again.
- `topos-zkevm-demo uninstall`: Uninstall Topos zkEVM Demo by cleaning your file system from the demo projects, shutting down the Erigon chain, etc.
- `topos-zkevm-demo version`: Display Topos zkEVM Demo's version

### Discussion

For community help or discussion, you can join the Topos Discord server:

[https://discord.gg/zMCqqCbGMV](https://discord.gg/zMCqqCbGMV)

## License

Licensed under either of

- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <http://opensource.org/licenses/MIT>)

at your option.
