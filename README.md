
## FRAMED!

Framed! is a fully on-chain social deduction game. 
This project is a submission to ETHGlobal NYC 2023.

## Overview

Framed! is a unique social deduction game inspired by the classic game Mafia. It leverages the power of Fully Homomorphic Encryption (FHE) to ensure on-chain privacy, allowing for hidden roles and actions. Its a blend of secret schemes, accusations, and strategy made possible by encrypted hidden inputs.

### Built Using ⚙️

- React
- Vite
- Privvy
- Solidity
- FHE

## Features

- Play a fully on-chain social deduction game.
- Maintain security and privacy with Fully Homomorphic Encryption (FHE).
- Experience secret roles and actions.
- Engage in discussions, strategy, and deception.
- Store encrypted states directly on-chain.

## Network

Explore Framed! on the Inco Testnet:

[**Game Contract**](https://explorer.inco.network/address/0xa3761B532C563857704B1824fB75421c8B86EF1D) | [**Get Inco Tokens**](https://faucetdev.inco.network/)

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the local development server using `npm run dev`.


---
=======
# FRAMED! — EthGlobal NY 2023 Hackathon Submission

---

Classic campfire game put onchain with cutting-edge fhEVM technology.

--

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
